FROM squidfunk/mkdocs-material:8.5.9

RUN pip install mike

# Overwrite ENTRYPOINT from squidfunk/mkdocs-material:8.5.9
ENTRYPOINT [""]

# Start mkdocs development server by default
CMD [ "mkdocs", "serve", "--dev-addr=0.0.0.0:8000" ]