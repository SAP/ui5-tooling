FROM squidfunk/mkdocs-material:8.5.9

# mike version 2 is required in order to enable ENV vars for the container. By the time mike 2 is released we'd
# use a specific dev version: https://github.com/jimporter/mike/issues/125
RUN python -m pip install 'mike @ git+https://github.com/jimporter/mike.git@e77357960886f9d9bf2e6ecbc39c7ca6991a2179'

# Define env variables for mike
ENV GIT_COMMITTER_NAME="OpenUI5 Bot"
ENV GIT_COMMITTER_EMAIL="openui5@sap.com"
