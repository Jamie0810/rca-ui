APP_NAME="rca_ui"
REPO=10.57.232.169:8800/rca/${APP_NAME}
REMOTE_PATH=/home/bigdata/deployment/images/demo
PHASE="demo"

TAG=${PHASE}
IMAGE_TAR=${APP_NAME}-${TAG}.tar

GIT_REPO="$(git branch | grep \* | cut -d ' ' -f2)"
[[ ${GIT_REPO} != ${PHASE} ]] && echo "you are not in ${PHASE} branch." && exit 1;

NOW=$(date +"%F_%T")
VERSION="${PHASE}_${NOW}"

mv ./.env ./_.env
mv ./.env.local ./_.env.local

mv ./_.env.${PHASE} ./.env.production &&\
REACT_APP_VERSION=${VERSION} npm run build &&\
mv ./.env.production ./_.env.${PHASE}

mv ./_.env ./.env
mv ./_.env.local ./.env.local

docker build --no-cache -t ${REPO}:${TAG} . &&\
mkdir -p ./target &&\
docker save ${REPO}:${TAG} > ./target/${IMAGE_TAR} &&\
docker rmi ${REPO}:${TAG} &&\
scp ./target/${IMAGE_TAR} bigdata@10.57.232.169:${REMOTE_PATH}
# rm -rf ./target/${IMAGE_TAR}

# TRACKED_REMOTE=$(cut -d'/' -f1 <<< $(git rev-parse --abbrev-ref --symbolic-full-name @{u}))

# DEV_HASH="$(git rev-parse HEAD)"
# git push --force ${TRACKED_REMOTE} ${DEV_HASH}:${PHASE} &&\

# delete local tag '12345'
# git tag -d ${TAG} &&\
# git push ${TRACKED_REMOTE} :refs/tags/${TAG} &&\

# git tag ${TAG} &&\
# git tag -fa ${TAG} ${DEV_HASH} -m "move dev tag" &&\
# git push ${TRACKED_REMOTE} ${TAG}
