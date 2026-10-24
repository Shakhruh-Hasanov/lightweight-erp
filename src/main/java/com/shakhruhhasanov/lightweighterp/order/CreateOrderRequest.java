package com.shakhruhhasanov.lightweighterp.order;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record CreateOrderRequest(

    @NotBlank  String customerNumber, 
    @NotEmpty @Valid  List<OrderLineRequest> lines
) {}
