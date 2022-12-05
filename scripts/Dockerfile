FROM squidfunk/mkdocs-material:8.5.9

# mike version 2 is required in order to enable ENV vars for the container. By the time mike 2 is released we'd
# use a specific dev version: https://github.com/jimporter/mike/issues/125
#
# An alternative to
# RUN pip install -e git+https://github.com/jimporter/mike.git@e77357960886f9d9bf2e6ecbc39c7ca6991a2179#egg=mike
# The command above always checks out the repo in "./src/mike" and ignores --target or --root flags. During container build
# mike command would be available, but after running it again it is not there anymore.
RUN cd /usr/local/lib/python3.9/site-packages/ && \
	mkdir mike && \
	git clone https://github.com/jimporter/mike.git && \
	cd mike && \
	git checkout e77357960886f9d9bf2e6ecbc39c7ca6991a2179 && \
	pip install -e .

# Define env variables for mike
ENV GIT_COMMITTER_NAME="OpenUI5 Bot"
ENV GIT_COMMITTER_EMAIL="openui5@sap.com"
