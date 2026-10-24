package com.shakhruhhasanov.lightweighterp.product;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record ProductUpdateRequest(
    @NotBlank  String name,
    String description,
    @NotNull UnitOfMeasure unitOfMeasure,
    @PositiveOrZero @NotNull BigDecimal costPrice,
    @PositiveOrZero @NotNull BigDecimal sellingPrice,
    String color,
    String size
) {



    
}
