#!/bin/bash

APP_NAME="rca_ui"
REPO=10.57.232.169:8800/rca/${APP_NAME}
REMOTE_PATH=/home/bigdata/deployment/images/staging
PHASE="staging"
VERSION="staging"

TRACKED_REMOTE=$(cut -d'/' -f1 <<< $(git rev-parse --abbrev-ref --symbolic-full-name @{u}))
GIT_REPO="$(git branch | grep \* | cut -d ' ' -f2)"

[[ ${GIT_REPO} != ${PHASE} ]] && echo "you are not in ${PHASE} branch." && exit 1;

LAST_TAG="$(git describe ${PHASE} --tags --match=production-*)"
echo "${LAST_TAG}"

IFS='-.' read -a array <<< "${LAST_TAG}"
#for element in ${array[@]}
#do
#    echo "${element}"
#done

show_options() {
  echo "current version is ${array[1]}.${array[2]}.${array[3]}"
  echo "1) Pack and publish current commit to version ${array[1]}.$((array[2] + 1)).0"
  echo "2) Pack and publish current commit to version ${array[1]}.${array[2]}.$((array[3] + 1))"
  echo "3) Pack and publish current commit to specific version"
#  echo "4) Re-pack ${array[1]}.${array[2]}.${array[3]}"
#  echo "5) Re-pack specific version"
  read OPTION
}

pack_docker_image() {
  TAG="$1"
  IMAGE_TAR="${APP_NAME}-${TAG}.tar"
  NOW=$(date +"%F_%T")

  mv ./.env ./_.env
  mv ./.env.local ./_.env.local

  mv ./_.env.${PHASE} ./.env.production &&\
  REACT_APP_VERSION="${VERSION}_${NOW}" npm run build &&\
  mv ./.env.production ./_.env.${PHASE}

  mv ./_.env ./.env
  mv ./_.env.local ./.env.local

  docker build --no-cache -t ${REPO}:${TAG} . &&\
  mkdir -p ./target &&\
  docker save ${REPO}:${TAG} > ./target/${IMAGE_TAR} &&\
  docker rmi ${REPO}:${TAG}
}

push_docker_image() {
  scp ./target/${IMAGE_TAR} bigdata@10.57.232.169:${REMOTE_PATH}
#  rm -rf ./target/${IMAGE_TAR}
}

stamp_repository_tag() {
  TAG=$1

  git tag ${TAG}
  git push ${TRACKED_REMOTE} ${TAG}
}

show_options

case "${OPTION}" in
  1)
    VERSION="${array[1]}.$((array[2] + 1)).0"
    TAG="${PHASE}-${VERSION}" &&\
    pack_docker_image ${TAG} && push_docker_image # && stamp_repository_tag ${TAG}
  ;;
  2)
    VERSION="${array[1]}.${array[2]}.$((array[3] + 1))"
    TAG="${PHASE}-${VERSION}" &&\
    pack_docker_image ${TAG} && push_docker_image # && stamp_repository_tag ${TAG}
  ;;
  3)
    echo "Version number: " && read VERSION
    TAG="${PHASE}-${VERSION}"
    echo "Pack and publish current commit to version ${TAG}. [Y]:" && read YN
    [[ ${YN} != "Y" ]] && echo "abort..." && exit 0;
    pack_docker_image ${TAG} && push_docker_image # && stamp_repository_tag ${TAG}
  ;;
#  4)
#    VERSION="${array[1]}.${array[2]}.${array[3]}"
#    TAG="${PHASE}-${VERSION}" &&\
#    git reset --hard ${TAG} &&\
#    pack_docker_image ${TAG} && push_docker_image &&\
#    git reset --hard ${TRACKED_REMOTE}/${PHASE}
#  ;;
#  5)
#    echo "please enter version."
#    read VERSION  &&\
#    TAG="${PHASE}-${VERSION}"
#    git reset --hard ${TAG} &&\
#    pack_docker_image ${TAG} && push_docker_image &&\
#    git reset --hard ${TRACKED_REMOTE}/${PHASE}
#  ;;
  *)
    echo "unknown." && exit 1;
  ;;
esac
