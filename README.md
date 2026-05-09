# gh-storage

Use a GitHub repository as file storage.

For one of our GitHub Actions systems, we needed file storage that would be
accessible across different workflows. We did not want to use a cloud storage
system because that would create another runtime dependency.

gh-storage uses a dedicated repository to store its files.
