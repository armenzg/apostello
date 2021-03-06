import re

import requests
from django.core.exceptions import ObjectDoesNotExist

from apostello.exceptions import ArchivedItemException

gsm_regex = re.compile(
    r'^[\w@?£!1$"¥#è?¤é%ù&ì\\ò(Ç)*:Ø+;ÄäøÆ,<LÖlöæ\-=ÑñÅß.>ÜüåÉ/§à¡¿\']+$'
)
non_gsm_regex = re.compile(
    r'[^\w@?£!1$"¥#è?¤é%ù&ì\\ò(Ç)*:Ø+;ÄäøÆ,<LÖlöæ\-=ÑñÅß.>ÜüåÉ/§à¡¿\'\s]'
)


def exists_and_archived(form, model_class, identifier):
    """
    Check if a user tries to create an object is now archived.

    Works for Groups, Recipients and Keywords.
    Returns the instance of the existing Person (etc) for editing if it exists,
    otherwise returns None.
    """
    unique_fields = {
        'keyword': 'keyword',
        'group': 'name',
        'recipient': 'number'
    }

    all_errors = [
        form.errors.as_data()[x][0].code for x in form.errors.as_data()
    ]
    try:
        instance = model_class.objects.get(
            **{
                unique_fields[identifier]: form.data[unique_fields[identifier]]
            }
        )
    except ObjectDoesNotExist:
        raise ArchivedItemException

    if ('unique' in all_errors) and instance.is_archived:
        return instance
    else:
        raise ArchivedItemException


def fetch_default_reply(msg=''):
    """Fetch default reply from database."""
    from site_config.models import DefaultResponses
    replies = DefaultResponses.get_solo().__dict__
    return replies[msg]


def get_default_number_prefix():
    """Fetch default number prefix from database."""
    from site_config.models import SiteConfiguration
    site_config = SiteConfiguration.get_solo()
    return site_config.default_number_prefix


def retry_request(url, http_method, *args, **kwargs):
    """Make a http request and retry 3 times if it fails."""
    assert http_method in ['get', 'post', 'delete', 'patch', 'put']
    MAX_TRIES = 3
    r_func = getattr(requests, http_method)
    tries = 0
    while True:
        resp = r_func(url, *args, **kwargs)
        if resp.status_code != 200 and tries < MAX_TRIES:
            tries += 1
            continue
        break

    return resp
