package com.sentinelx.dto;

import jakarta.validation.constraints.NotBlank;

public class IncidentStatusUpdateDto {

    @NotBlank(message = "Status cannot be blank")
    private String status;

    private String comment;

    public IncidentStatusUpdateDto() {}

    public IncidentStatusUpdateDto(String status, String comment) {
        this.status = status;
        this.comment = comment;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
