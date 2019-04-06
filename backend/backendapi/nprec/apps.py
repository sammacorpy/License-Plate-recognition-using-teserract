from django.apps import AppConfig


class NprecConfig(AppConfig):
    name = 'nprec'
    def ready(self):
        # Makes sure all signal handlers are connected
        from . import handlers  # noqa