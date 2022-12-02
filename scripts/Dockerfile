FROM squidfunk/mkdocs-material:8.5.9

# ENV mike version 2 is required in order to enable ENV vars for the container. By the time mike 2 is released we'd use a specific dev version
RUN pip install "mike>=2" || pip install -e git+https://github.com/jimporter/mike.git@2faa33ca4cf0da62c9c0ac7fbe8b60688733d7f1#egg=mike

# Define env variables to for mike
ENV GIT_COMMITTER_NAME="OpenUI5 Bot"
ENV GIT_COMMITTER_EMAIL="openui5@sap.com"

# Overwrite ENTRYPOINT from squidfunk/mkdocs-material:8.5.9
ENTRYPOINT [""]

# Start mkdocs development server by default
CMD [ "mkdocs", "serve", "--dev-addr=0.0.0.0:8000" ]
