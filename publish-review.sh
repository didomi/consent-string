# Bump the package.json and edit the changelogs of changed packages. Publish the packages into the registry. Finally push the changes into the gitlab repo
ESCAPED_COMMIT_BRANCH=$(echo $CI_COMMIT_BRANCH | perl -pe 's/\//\\\//')
perl -pi -e "s/BRANCH_NAME/$ESCAPED_COMMIT_BRANCH/" '.releaserc-branches.yml'
perl -pi -e "s/COMMIT_SHA/next-$CI_COMMIT_SHORT_SHA/" '.releaserc-branches.yml'
cp -f .releaserc-branches.yml .releaserc.yml

npm run semantic-release
