#!/bin/bash
#calculates time difference between trigger and recover events for entire camera syslog
#tested on: DCS-2530L

[[ $@ =~ ([0-9]{1,3}\.){3}[0-9]{1,3} ]] && ip=${BASH_REMATCH[0]}

if [ -z "$ip" ]; then
  echo "Usage: $(basename "$0") ip"
  exit 1
fi

server=$(getserver "$ip")

case $server in
   
   Embedthis-Appweb*)

        while read -r date1 time1 eventh1 event1 rest1; do
            
            [[ "$event1" != "trigger" ]] && continue # start on 'trigger' event
            
            read -r date2 time2 eventh2 event2 rest2
            
            sec1970_1=$(date -d "$date1 $time1" '+%s')
           [[ ! -z $sec1970_2 ]] && nomotion_sec=$((sec1970_1-sec1970_2))
            sec1970_2=$(date -d "$date2 $time2" '+%s')
            
            echo "$(( "$sec1970_1" * 1000)) $(( "$sec1970_2" * 1000)) $date1 $time1 $time2 $(printf "%2d %4d" $(( "$sec1970_2" - "$sec1970_1"  )) "$nomotion_sec" )"
        done < <(dlog -m "$ip")
        ;;
    *)

      echo "Server not supported: $server"
      exit 1
      ;;

esac