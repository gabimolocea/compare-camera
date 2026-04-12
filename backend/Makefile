PYTHON = .venv/bin/python
MANAGE = $(PYTHON) manage.py

.PHONY: run migrate makemigrations shell check createsuperuser seed

run:
	$(MANAGE) runserver

migrate:
	$(MANAGE) migrate

makemigrations:
	$(MANAGE) makemigrations

shell:
	$(MANAGE) shell

check:
	$(MANAGE) check

createsuperuser:
	$(MANAGE) createsuperuser

seed:
	$(MANAGE) seed

seed-clear:
	$(MANAGE) seed --clear
