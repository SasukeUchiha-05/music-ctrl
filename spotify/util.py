from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get

BASE_URL = "https://api.spotify.com/v1/me/"

def get_user_tokens(session_id):
    return SpotifyToken.objects.filter(user=session_id).first()

def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)
    
    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token if refresh_token else tokens.refresh_token  # Use old refresh token if new one is not provided
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        if not refresh_token:
            raise ValueError("Refresh token is None")
        tokens = SpotifyToken(
            user=session_id,
            access_token=access_token,
            refresh_token=refresh_token,
            token_type=token_type,
            expires_in=expires_in
        )
        tokens.save()

def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            print("Access token expired. Refreshing...")
            refresh_spotify_token(session_id)  
        
        return True
    return False   

def refresh_spotify_token(session_id):
    tokens = get_user_tokens(session_id)
    if not tokens:
        print("No Spotify token found for user.")
        return None

    refresh_token = tokens.refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    if "error" in response:
        print(f"Error refreshing token: {response}")  # Debugging info
        return None

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in', 3600)  # Default to 1 hour
    # new_refresh_token = response.get('refresh_token', refresh_token)  # Use new refresh token if available

    update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)

def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)

    if not tokens:
        return {'error': 'User not authenticated'}

    # Check if token is expired before making request
    if tokens.expires_in <= timezone.now():
        print("Access token expired. Refreshing...")
        refresh_spotify_token(session_id)
        tokens = get_user_tokens(session_id)  # Get updated token

    headers = {'Content-Type': 'application/json', 'Authorization': "Bearer " + tokens.access_token}

    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        put(BASE_URL + endpoint, headers=headers)

    response = get(BASE_URL + endpoint, headers=headers)
    
    try:
        return response.json()
    except:
        return {'Error': 'Issue with request'}
    
def play_song(session_id):
    return execute_spotify_api_request(session_id, "player/play", put_=True)

def pause_song(session_id):
    return execute_spotify_api_request(session_id, "player/pause", put_=True)
