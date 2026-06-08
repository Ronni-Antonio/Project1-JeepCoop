#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, Symbol, token
};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    NextRequestId,
    Request(u32),
    DriverBalance(Address),
    Token,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PayoutRequest {
    pub driver: Address,
    pub amount: i128,
    pub reason: Symbol,
    pub approved: bool,
}

#[contract]
pub struct JeepneyCoopContract;

#[contractimpl]
impl JeepneyCoopContract {
    pub fn initialize(env: Env, admin: Address, token: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::NextRequestId, &0u32);
    }

    pub fn contribute(env: Env, driver: Address, amount: i128) {
        driver.require_auth();
        
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).expect("not initialized");
        let client = token::Client::new(&env, &token_addr);
        
        client.transfer(&driver, &env.current_contract_address(), &amount);
        
        let mut balance: i128 = env.storage().persistent().get(&DataKey::DriverBalance(driver.clone())).unwrap_or(0);
        balance += amount;
        env.storage().persistent().set(&DataKey::DriverBalance(driver), &balance);
    }

    pub fn request_payout(env: Env, driver: Address, amount: i128, reason: Symbol) -> u32 {
        driver.require_auth();
        
        let id: u32 = env.storage().instance().get(&DataKey::NextRequestId).unwrap_or(0);
        let request = PayoutRequest {
            driver: driver.clone(),
            amount,
            reason,
            approved: false,
        };
        
        env.storage().persistent().set(&DataKey::Request(id), &request);
        env.storage().instance().set(&DataKey::NextRequestId, &(id + 1));
        id
    }

    pub fn approve_payout(env: Env, request_id: u32) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("not initialized");
        admin.require_auth();
        
        let mut request: PayoutRequest = env.storage().persistent().get(&DataKey::Request(request_id)).expect("request not found");
        if request.approved {
            panic!("request already approved");
        }
        
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).expect("token not set");
        let client = token::Client::new(&env, &token_addr);
        
        client.transfer(&env.current_contract_address(), &request.driver, &request.amount);
        
        request.approved = true;
        env.storage().persistent().set(&DataKey::Request(request_id), &request);
    }

    pub fn get_pool_balance(env: Env) -> i128 {
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).expect("token not set");
        let client = token::Client::new(&env, &token_addr);
        client.balance(&env.current_contract_address())
    }

    pub fn get_driver_contribution(env: Env, driver: Address) -> i128 {
        env.storage().persistent().get(&DataKey::DriverBalance(driver)).unwrap_or(0)
    }
    
    pub fn get_request(env: Env, request_id: u32) -> PayoutRequest {
        env.storage().persistent().get(&DataKey::Request(request_id)).expect("request not found")
    }

    pub fn get_next_request_id(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::NextRequestId).unwrap_or(0)
    }
}

mod test;
