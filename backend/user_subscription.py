"""
User Subscription Module

This module provides functions for managing user subscriptions and checking subscription status.
"""

import os
from datetime import datetime, timedelta
import json

# Path to the subscription data file
SUBSCRIPTION_DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'subscriptions.json')

# Trial period in days
TRIAL_PERIOD_DAYS = 7

def ensure_subscription_data_file():
    """Ensure the subscription data file exists"""
    os.makedirs(os.path.dirname(SUBSCRIPTION_DATA_FILE), exist_ok=True)
    if not os.path.exists(SUBSCRIPTION_DATA_FILE):
        with open(SUBSCRIPTION_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump({}, f)

def get_user_subscription_status(user_id):
    """
    Get the subscription status for a user

    Args:
        user_id (str): The user ID

    Returns:
        str: The subscription status ('Free', 'Premium', or 'Trial')
    """
    if not user_id:
        return 'Free'

    ensure_subscription_data_file()

    try:
        with open(SUBSCRIPTION_DATA_FILE, 'r', encoding='utf-8') as f:
            subscriptions = json.load(f)

        user_subscription = subscriptions.get(str(user_id), {})

        # Check if the user has an active subscription
        if user_subscription.get('status') == 'active':
            # Check if the subscription has expired
            expiry_date = user_subscription.get('expiry_date')
            if expiry_date and datetime.fromisoformat(expiry_date) > datetime.now():
                return 'Premium'

        # Check if the user has an active trial
        if user_subscription.get('status') == 'trial':
            # Check if the trial has expired
            expiry_date = user_subscription.get('expiry_date')
            if expiry_date and datetime.fromisoformat(expiry_date) > datetime.now():
                return 'Trial'

        return 'Free'
    except Exception as e:
        print(f"Error getting subscription status: {e}")
        return 'Free'

def update_user_subscription(user_id, subscription_id, plan_id, status='active'):
    """
    Update the subscription status for a user

    Args:
        user_id (str): The user ID
        subscription_id (str): The PayPal subscription ID
        plan_id (str): The subscription plan ID
        status (str): The subscription status ('active' or 'cancelled')

    Returns:
        bool: True if the update was successful, False otherwise
    """
    if not user_id:
        return False

    ensure_subscription_data_file()

    try:
        with open(SUBSCRIPTION_DATA_FILE, 'r', encoding='utf-8') as f:
            subscriptions = json.load(f)

        # Calculate expiry date (1 month from now for simplicity)
        expiry_date = (datetime.now().replace(
            month=datetime.now().month + 1 if datetime.now().month < 12 else 1,
            year=datetime.now().year + (1 if datetime.now().month == 12 else 0)
        )).isoformat()

        # Update the subscription
        subscriptions[str(user_id)] = {
            'subscription_id': subscription_id,
            'plan_id': plan_id,
            'status': status,
            'start_date': datetime.now().isoformat(),
            'expiry_date': expiry_date,
            'updated_at': datetime.now().isoformat()
        }

        with open(SUBSCRIPTION_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(subscriptions, f, indent=2)

        return True
    except Exception as e:
        print(f"Error updating subscription: {e}")
        return False

def cancel_user_subscription(user_id):
    """
    Cancel the subscription for a user

    Args:
        user_id (str): The user ID

    Returns:
        bool: True if the cancellation was successful, False otherwise
    """
    if not user_id:
        return False

    ensure_subscription_data_file()

    try:
        with open(SUBSCRIPTION_DATA_FILE, 'r', encoding='utf-8') as f:
            subscriptions = json.load(f)

        if str(user_id) in subscriptions:
            subscriptions[str(user_id)]['status'] = 'cancelled'
            subscriptions[str(user_id)]['updated_at'] = datetime.now().isoformat()

            with open(SUBSCRIPTION_DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(subscriptions, f, indent=2)

            return True

        return False
    except Exception as e:
        print(f"Error cancelling subscription: {e}")
        return False

def activate_trial(user_id):
    """
    Activate a trial subscription for a user

    Args:
        user_id (str): The user ID

    Returns:
        bool: True if the trial activation was successful, False otherwise
    """
    if not user_id:
        return False

    # Check if the user already has an active subscription or trial
    current_status = get_user_subscription_status(user_id)
    if current_status in ['Premium', 'Trial']:
        return False

    ensure_subscription_data_file()

    try:
        with open(SUBSCRIPTION_DATA_FILE, 'r', encoding='utf-8') as f:
            subscriptions = json.load(f)

        # Calculate trial expiry date (TRIAL_PERIOD_DAYS from now)
        expiry_date = (datetime.now() + timedelta(days=TRIAL_PERIOD_DAYS)).isoformat()

        # Update the subscription
        subscriptions[str(user_id)] = {
            'subscription_id': 'trial',
            'plan_id': 'trial',
            'status': 'trial',
            'start_date': datetime.now().isoformat(),
            'expiry_date': expiry_date,
            'updated_at': datetime.now().isoformat()
        }

        with open(SUBSCRIPTION_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(subscriptions, f, indent=2)

        return True
    except Exception as e:
        print(f"Error activating trial: {e}")
        return False

def get_trial_remaining_days(user_id):
    """
    Get the number of days remaining in a user's trial

    Args:
        user_id (str): The user ID

    Returns:
        int: The number of days remaining in the trial, or 0 if not in a trial
    """
    if not user_id:
        return 0

    ensure_subscription_data_file()

    try:
        with open(SUBSCRIPTION_DATA_FILE, 'r', encoding='utf-8') as f:
            subscriptions = json.load(f)

        user_subscription = subscriptions.get(str(user_id), {})

        # Check if the user has an active trial
        if user_subscription.get('status') == 'trial':
            # Check if the trial has expired
            expiry_date = user_subscription.get('expiry_date')
            if expiry_date:
                expiry_datetime = datetime.fromisoformat(expiry_date)
                if expiry_datetime > datetime.now():
                    # Calculate days remaining
                    delta = expiry_datetime - datetime.now()
                    return max(0, delta.days)

        return 0
    except Exception as e:
        print(f"Error getting trial remaining days: {e}")
        return 0

def get_subscription_details(user_id):
    """
    Get detailed subscription information for a user

    Args:
        user_id (str): The user ID

    Returns:
        dict: Subscription details including status, expiry date, and days remaining
    """
    if not user_id:
        return {
            'status': 'Free',
            'expiry_date': None,
            'days_remaining': 0,
            'is_trial': False
        }

    ensure_subscription_data_file()

    try:
        with open(SUBSCRIPTION_DATA_FILE, 'r', encoding='utf-8') as f:
            subscriptions = json.load(f)

        user_subscription = subscriptions.get(str(user_id), {})
        status = get_user_subscription_status(user_id)
        expiry_date = user_subscription.get('expiry_date')
        days_remaining = 0
        is_trial = status == 'Trial'

        if expiry_date:
            expiry_datetime = datetime.fromisoformat(expiry_date)
            if expiry_datetime > datetime.now():
                delta = expiry_datetime - datetime.now()
                days_remaining = max(0, delta.days)

        return {
            'status': status,
            'expiry_date': expiry_date,
            'days_remaining': days_remaining,
            'is_trial': is_trial
        }
    except Exception as e:
        print(f"Error getting subscription details: {e}")
        return {
            'status': 'Free',
            'expiry_date': None,
            'days_remaining': 0,
            'is_trial': False
        }

def get_subscription_plans():
    """
    Get the available subscription plans

    Returns:
        list: A list of subscription plans
    """
    # In a real implementation, this would fetch plans from a database or PayPal API
    return [
        {
            'id': 'basic_monthly',
            'name': 'Basic Monthly',
            'description': 'Basic monthly subscription',
            'price': 9.99,
            'currency': 'USD',
            'interval': 'month'
        },
        {
            'id': 'premium_monthly',
            'name': 'Premium Monthly',
            'description': 'Premium monthly subscription with all features',
            'price': 19.99,
            'currency': 'USD',
            'interval': 'month'
        },
        {
            'id': 'premium_yearly',
            'name': 'Premium Yearly',
            'description': 'Premium yearly subscription with all features (save 20%)',
            'price': 191.90,
            'currency': 'USD',
            'interval': 'year'
        }
    ]
