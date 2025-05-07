"""
Subscription Routes

This module provides API routes for managing subscriptions.
"""

from flask import Blueprint, request, jsonify, session
from user_subscription import (
    get_user_subscription_status,
    update_user_subscription,
    cancel_user_subscription,
    get_subscription_plans,
    activate_trial,
    get_subscription_details
)

subscription_bp = Blueprint('subscription_bp', __name__)

@subscription_bp.route('/api/subscription/status', methods=['GET'])
def get_subscription_status():
    """Get the subscription status for the current user"""
    user_id = session.get('user_id')
    status = get_user_subscription_status(user_id)
    return jsonify({
        'status': status,
        'is_premium': status == 'Premium'
    })

@subscription_bp.route('/api/subscription/plans', methods=['GET'])
def get_plans():
    """Get available subscription plans"""
    plans = get_subscription_plans()
    return jsonify(plans)

@subscription_bp.route('/api/subscription/activate', methods=['POST'])
def activate_subscription():
    """Activate a subscription for the current user"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401

    data = request.json
    if not data or 'subscription_id' not in data or 'plan_id' not in data:
        return jsonify({'error': 'Invalid request data'}), 400

    subscription_id = data['subscription_id']
    plan_id = data['plan_id']

    success = update_user_subscription(user_id, subscription_id, plan_id)
    if success:
        return jsonify({
            'success': True,
            'message': 'Subscription activated successfully',
            'status': 'Premium'
        })
    else:
        return jsonify({'error': 'Failed to activate subscription'}), 500

@subscription_bp.route('/api/subscription/cancel', methods=['POST'])
def cancel_subscription():
    """Cancel the subscription for the current user"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401

    success = cancel_user_subscription(user_id)
    if success:
        return jsonify({
            'success': True,
            'message': 'Subscription cancelled successfully',
            'status': 'Free'
        })
    else:
        return jsonify({'error': 'Failed to cancel subscription'}), 500

@subscription_bp.route('/api/subscription/activate-trial', methods=['POST'])
def activate_trial_subscription():
    """Activate a trial subscription for the current user"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401

    success = activate_trial(user_id)
    if success:
        return jsonify({
            'success': True,
            'message': 'Trial activated successfully',
            'status': 'Trial'
        })
    else:
        return jsonify({'error': 'Failed to activate trial. You may already have an active subscription or trial.'}), 400

@subscription_bp.route('/api/subscription/details', methods=['GET'])
def get_user_subscription_details():
    """Get detailed subscription information for the current user"""
    user_id = session.get('user_id')
    details = get_subscription_details(user_id)
    return jsonify(details)
