package com.sentinelx.controller;

import com.sentinelx.dto.ApiResponse;
import com.sentinelx.model.Asset;
import com.sentinelx.repository.AssetRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assets")
@Tag(name = "Assets", description = "Enterprise Infrastructure & Asset Inventory")
public class AssetController {

    private final AssetRepository assetRepository;

    public AssetController(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @GetMapping
    @Operation(summary = "Get list of monitored enterprise assets ordered by criticality")
    public ApiResponse<List<Asset>> getAssets(
            @RequestParam(required = false) UUID organizationId) {
        UUID org = organizationId != null ? organizationId : IncidentController.DEFAULT_ORG_ID;
        return ApiResponse.ok(assetRepository.findByOrganizationIdOrderByCriticalityDesc(org));
    }
}
