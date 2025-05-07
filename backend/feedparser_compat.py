"""
Compatibility module for feedparser with Python 3.13+

This module provides a compatibility layer for the 'cgi' module that was removed in Python 3.13.
It monkey patches the necessary functions that feedparser relies on.

It also provides a fallback mechanism if feedparser is not installed.
"""

import sys
import html
import urllib.parse
import importlib.util

# Check if we're running on Python 3.13 or newer
PY_VERSION = sys.version_info
NEEDS_COMPAT = PY_VERSION.major == 3 and PY_VERSION.minor >= 13

# Check if feedparser is installed
FEEDPARSER_INSTALLED = importlib.util.find_spec("feedparser") is not None

# Only apply the patch if we're running on Python 3.13+ and feedparser is installed
if NEEDS_COMPAT and FEEDPARSER_INSTALLED:
    # Create a fake 'cgi' module
    class FakeCGIModule:
        def __init__(self):
            self.escape = html.escape

        def parse_header(self, line):
            """Parse a Content-type like header.

            Return the main content-type and a dictionary of parameters.
            """
            if not line:
                return '', {}

            parts = line.split(';')
            key = parts[0].strip()
            params = {}

            for part in parts[1:]:
                if '=' not in part:
                    continue
                name, value = part.split('=', 1)
                name = name.strip()
                value = value.strip()
                if value.startswith('"') and value.endswith('"'):
                    value = value[1:-1]
                params[name] = value

            return key, params

    # Create and install the fake module
    sys.modules['cgi'] = FakeCGIModule()

    print("Installed feedparser compatibility layer for Python 3.13+")

# Import feedparser after the patch if it's installed
if FEEDPARSER_INSTALLED:
    try:
        import feedparser
        FEEDPARSER_IMPORT_SUCCESS = True
    except ImportError:
        FEEDPARSER_IMPORT_SUCCESS = False
        print("Warning: Failed to import feedparser even though it appears to be installed.")
else:
    FEEDPARSER_IMPORT_SUCCESS = False
    print("Warning: feedparser is not installed. AI news functionality will be disabled.")
    print("To enable AI news, install feedparser with: pip install feedparser==6.0.10")

# Function to safely parse feeds with compatibility layer
def parse(url_or_string, **kwargs):
    """
    Parse a feed with compatibility layer for Python 3.13+

    This is a wrapper around feedparser.parse that ensures compatibility
    with Python 3.13+ by handling the missing 'cgi' module.

    If feedparser is not installed, returns a dummy feed object.

    Args:
        url_or_string: URL or string to parse
        **kwargs: Additional arguments to pass to feedparser.parse

    Returns:
        Parsed feed object or dummy feed object if feedparser is not installed
    """
    if FEEDPARSER_IMPORT_SUCCESS:
        return feedparser.parse(url_or_string, **kwargs)
    else:
        # Return a dummy feed object
        class DummyEntry:
            def __init__(self):
                self.title = "Feedparser not installed"
                self.summary = "Please install feedparser to enable AI news functionality."
                self.link = "#"

        class DummyFeed:
            def __init__(self):
                self.entries = [DummyEntry()]

        return DummyFeed()
