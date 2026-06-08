#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, Symbol};

#[test]
fn test_coop_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let driver = Address::generate(&env);
    
    // Register token contract
    let token_admin = Address::generate(&env);
    let token_id = env.register_stellar_asset_contract(token_admin.clone());
    let token_client = token::StellarAssetClient::new(&env, &token_id);
    let token_query_client = token::Client::new(&env, &token_id);

    // Register coop contract
    let contract_id = env.register(JeepneyCoopContract, ());
    let client = JeepneyCoopContractClient::new(&env, &contract_id);

    // Initialize
    client.initialize(&admin, &token_id);

    // Mint some tokens to driver
    token_client.mint(&driver, &1000);

    // Driver contributes
    client.contribute(&driver, &500);
    assert_eq!(client.get_driver_contribution(&driver), 500);
    assert_eq!(client.get_pool_balance(), 500);
    assert_eq!(token_query_client.balance(&driver), 500);

    // Driver requests payout
    let reason = Symbol::new(&env, "sick");
    let request_id = client.request_payout(&driver, &200, &reason);
    
    let request = client.get_request(&request_id);
    assert_eq!(request.driver, driver);
    assert_eq!(request.amount, 200);
    assert_eq!(request.reason, reason);
    assert_eq!(request.approved, false);

    // Admin approves payout
    client.approve_payout(&request_id);
    
    let request_after = client.get_request(&request_id);
    assert_eq!(request_after.approved, true);
    assert_eq!(client.get_pool_balance(), 300);
    assert_eq!(token_query_client.balance(&driver), 700);
}
