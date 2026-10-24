package com.shakhruhhasanov.lightweighterp.customer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity 
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank 
    @Column(nullable = false, unique = true, length = 50)
    private String customerNumber;

    @NotBlank 
    @Column(nullable = false, length = 150)
    private String displayName;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CustomerType customerType;

    @Email 
    @Column(length = 150)
    private String email;

    @Column(length = 50)
    private String phone;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CustomerStatus customerStatus = CustomerStatus.ACTIVE;

    protected Customer() {
    }

    public Customer(String customerNumber, 
                    String displayName, 
                    CustomerType customerType,
                    String email, String phone
                    ) 
                {
                    this.customerNumber = customerNumber;
                    this.displayName = displayName;
                    this.customerType = customerType;
                    this.email = email;
                    this.phone = phone;
                }

    public Long getId() {
        return id;
    }

    public String getCustomerNumber() {
        return customerNumber;
    }

    public void setCustomerNumber(String customerNumber) {
        this.customerNumber = customerNumber;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public CustomerType getCustomerType() {
        return customerType;
    }

    public void setCustomerType(CustomerType customerType) {
        this.customerType = customerType;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public CustomerStatus getCustomerStatus() {
        return customerStatus;
    }

    public void activate(){
        this.customerStatus = CustomerStatus.ACTIVE;
    }

    public void deactivate(){
        this.customerStatus = CustomerStatus.INACTIVE;
    }
    
    public void block(){
        this.customerStatus = CustomerStatus.BLOCKED;
    }


    

}
