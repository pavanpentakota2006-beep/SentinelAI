package com.sentinelx.db;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** Applies all Flyway migrations to a real PostgreSQL container and checks core guarantees. */
@Testcontainers
class MigrationIT {

    @Container
    static final PostgreSQLContainer<?> PG = new PostgreSQLContainer<>("postgres:16-alpine");

    private JdbcTemplate migrate() {
        var ds = new DriverManagerDataSource(PG.getJdbcUrl(), PG.getUsername(), PG.getPassword());
        Flyway.configure().dataSource(ds).locations("classpath:db/migration").load().migrate();
        return new JdbcTemplate(ds);
    }

    @Test
    void migrationsSeedFourRolesAndDenyByDefaultPermissions() {
        var jdbc = migrate();
        assertThat(jdbc.queryForObject("select count(*) from roles", Integer.class)).isEqualTo(4);
        Integer viewerWrites = jdbc.queryForObject("""
            select count(*) from role_permissions rp
              join roles r on r.id = rp.role_id
              join permissions p on p.id = rp.permission_id
             where r.name = 'READ_ONLY_VIEWER' and p.code like '%:write'""", Integer.class);
        assertThat(viewerWrites).isZero();
    }

    @Test
    void auditLogIsAppendOnly() {
        var jdbc = migrate();
        jdbc.update("insert into audit_logs(action) values ('TEST')");
        assertThatThrownBy(() -> jdbc.update("delete from audit_logs"))
            .hasMessageContaining("append-only");
    }
}
