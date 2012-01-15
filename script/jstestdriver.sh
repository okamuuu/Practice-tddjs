#!/bin/sh

CWD=`pwd`

JSTESTDRIVER_BIN=${CWD}/bin/JsTestDriver-1.3.3d.jar
JSTESTDRIVER_CONF=${CWD}/conf/jsTestDriver.conf

SAFARI=script/safari
FIREFOX=script/firefox
CHROME=script/chrome

FULL=1
if [ $FULL = 0 ];then
    BROWSERS=${CHROME}
else
    BROWSERS=${SAFARI},${FIREFOX},${CHROME}
fi

(java -jar ${JSTESTDRIVER_BIN} \
    --port 4224 \
    --config ${JSTESTDRIVER_CONF} \
    --browser  ${BROWSERS} \
    --tests all \
    --verbose \
    --captureConsole
    )


