# Extract branch and commit info
ESCAPED_COMMIT_BRANCH=$(echo $CI_MERGE_REQUEST_SOURCE_BRANCH_NAME | perl -pe 's/\//\\\//')
perl -pi -e "s/BRANCH_NAME/$ESCAPED_COMMIT_BRANCH/" '.releaserc-branches.yml'
perl -pi -e "s/COMMIT_SHA/$CI_COMMIT_SHORT_SHA/" '.releaserc-branches.yml'
cp -f .releaserc-branches.yml .releaserc.yml

# Run semantic-release with clean environment and explicit parameters
npm run semantic-release