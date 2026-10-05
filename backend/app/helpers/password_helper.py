import bcrypt


def hash_password(password: str) -> str:
    """
    Hashes a plain-text password using bcrypt with a secure random salt.
    
    :param password: Raw plain-text password.
    :return: Salted and hashed password string.
    """
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain-text password against an existing bcrypt hash.
    
    :param plain_password: Raw password to verify.
    :param hashed_password: Stored bcrypt hash from the database.
    :return: True if the password matches, False otherwise.
    """
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    except (ValueError, TypeError):
        return False
