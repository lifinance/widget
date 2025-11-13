# Releasing

This document describes the release process for the LI.FI Widget packages.

## Overview

The project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and releases. The release process is automated through GitHub Actions workflows.

## Release Process

### 1. Creating Changesets

When making changes that affect package versions, contributors need to create a changeset:

1. Run `pnpm changeset` to create a new changeset file
2. Select the packages affected by your changes
3. Choose the version bump type (patch, minor, or major)
4. Write a description of your changes
5. Commit the changeset file along with your changes

Changesets accumulate in the `.changeset/` directory and can be batched together before versioning.

### 2. Automated Version PR Creation

When changesets are merged to `main`, the versioning process is automated:

1. The "Changesets" workflow automatically runs on every push to `main`
2. If there are pending changesets, it creates a "Version Packages" PR with all accumulated changesets
3. Review and merge the version PR to bump versions and update changelogs
4. After merging, create and push a git tag matching the new version (e.g., `v3.34.2`)
5. Pushing the tag will automatically trigger the publish workflow to build and publish packages to npm

This allows multiple changes to be batched into a single release version. The workflow only creates a version PR when there are pending changesets, so it won't create empty PRs if no changesets exist.

### 3. Publishing

After the version PR is merged and a git tag is pushed:

- The `publish.yaml` workflow automatically triggers
- Packages are built and published to npm
- A GitHub Release is created automatically
- For alpha/beta tags, packages are published with the corresponding npm tag

## Manual Release Commands

If you need to manually trigger parts of the release process:

- `pnpm release:version` - Bump versions and update changelogs
- `pnpm release:build` - Build all packages
- `pnpm release:publish` - Build and publish to npm (requires NPM_TOKEN)
- `pnpm release:publish:alpha` - Publish alpha snapshot release
- `pnpm release:publish:beta` - Publish beta snapshot release

## Workflow Files

- `.github/workflows/changesets.yml` - Automatically creates version PRs on push to main
- `.github/workflows/publish.yaml` - Publishes packages when git tags are pushed
- `.github/workflows/changeset-check.yml` - Validates that PRs include changesets

