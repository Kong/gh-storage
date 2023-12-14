# gh-storage: Use a GitHub repository as file storage

For one of our GitHub Action based systems, we needed a files storage that would be
accessible across different workflows.  We did not want to use a cloud based storage
system as that would create another run-time dependency.

gh-storage uses a dedicated repository to store its files.
