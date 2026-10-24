package com.shakhruhhasanov.lightweighterp.order;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record OrderLineRequest (
    @NotBlank String sku, 
    @NotNull @Positive  BigDecimal quantity){}

    

