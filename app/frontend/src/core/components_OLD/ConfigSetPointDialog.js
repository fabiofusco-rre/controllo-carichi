import {
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import ConfigDialog from "./common/ConfigDialog";
import SliderComponent from "./common/SliderComponent";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function ConfigSetPointDialog({
  zones,
  title,
  description,
  open,
  onClose,
  onSave,
  dailySchedule,
  worksMode,
  workModeConfig,
}) {

  const getSetPointsRanges = (dailySchedule) => {
    let ranges = [];
    let idxRange = -1;

    const fixRange = (num) => +num + 1;

    dailySchedule.map((schedule, idx) => {
      if (idx === 0 || ranges[idxRange].workMode !== schedule.workMode) {
        idxRange++;
        ranges[idxRange] = {
          position: idxRange,
          start: +schedule.hour,
          end: fixRange(schedule.hour),
          workMode: schedule.workMode,
          setPoint: schedule.setPoint
        };
      } else {
        ranges[idxRange].end = fixRange(schedule.hour);
      }
    });
    return thresholdManager(ranges);
  };

  const splitInterval = (position) => {
    let _setPointsRanges = JSON.parse(JSON.stringify(setPointsRanges));
    _setPointsRanges = _setPointsRanges.sort((a, b) => a.position - b.position);

    let newInterval;
    for (let i = position; i < _setPointsRanges.length; i++) {
      if (i === position) {
        newInterval = JSON.parse(JSON.stringify(_setPointsRanges[i]));

        let offset = _setPointsRanges[i].end - _setPointsRanges[i].start;
        const splitStart =
          _setPointsRanges[i].start +
          (offset > 1 ? Math.floor(offset / 2) : offset);
        _setPointsRanges[i].end = splitStart;
        newInterval.start = splitStart;

        _setPointsRanges.splice(position + 1, 0, newInterval);
      } else {
        _setPointsRanges[i].position++;
      }
    }
    _setPointsRanges = thresholdManager(_setPointsRanges);
    setSetPointsRanges(_setPointsRanges);
  };

  const removeInterval = (position) => {
    let _setPointsRanges = JSON.parse(JSON.stringify(setPointsRanges));
    _setPointsRanges = _setPointsRanges.sort((a, b) => a.position - b.position);

    const toRemove = _setPointsRanges[position];
    if (_setPointsRanges.length > 1) {
      if (position === 0) {
        _setPointsRanges[position + 1] = {
          ..._setPointsRanges[position + 1],
          start: toRemove.start,
        };
      } else {
        _setPointsRanges[position - 1] = {
          ..._setPointsRanges[position - 1],
          end: toRemove.end,
        };
      }
    }
    _setPointsRanges.splice(position, 1);
    _setPointsRanges.map((range, idx) => (range.position = idx));

    _setPointsRanges = thresholdManager(_setPointsRanges);
    setSetPointsRanges(_setPointsRanges);
  };

  const thresholdManager = (ranges) => {
    ranges = ranges.sort((a, b) => a.start - b.start);
    for (let i = 0; i < ranges.length; i++) {
      //const th_start_min = i > 0 ? +ranges[i - 1].end : 0;
      const th_start_min = i > 0 ? +ranges[i - 1].start + 1 : 0;
      const th_start_max = i > 0 ? +ranges[i].end - 1 : 0;

      const th_end_min = i < ranges.length - 1 ? +ranges[i].start + 1 : 24;
      //const th_end_max = i < ranges.length-1 ? +ranges[i+1].start : 24
      const th_end_max = i < ranges.length - 1 ? +ranges[i + 1].end - 1 : 24;

      let prevLinkRange;
      if (ranges[i - 1]?.end === ranges[i]?.start) {
        prevLinkRange = ranges[i - 1].position;
      }
      let nextLinkRange;
      if (ranges[i]?.end === ranges[i + 1]?.start) {
        nextLinkRange = ranges[i + 1].position;
      }

      ranges[i] = {
        ...ranges[i],
        thStart: [th_start_min, th_start_max],
        thEnd: [th_end_min, th_end_max],
        prevLinkRange,
        nextLinkRange,
        canSplitInterval: ranges[i]?.end - ranges[i]?.start > 1,
      };
    }
    return ranges;
  };

  const [setPointsRanges, setSetPointsRanges] = React.useState(
    getSetPointsRanges(dailySchedule)
  );

  const handleSetPointsRanges = (
    idxRange,
    workMode,
    start,
    end,
    skipCheck = false
  ) => {
    const { thStart, thEnd, prevLinkRange, nextLinkRange } =
      setPointsRanges[idxRange];
    let error = null;

    if (start < thStart[0] || start > thStart[1]) {
      start = start <= thStart[0] ? thStart[0] : thStart[1];
    }

    if (end < thEnd[0] || end > thEnd[1]) {
      end = end <= thEnd[0] ? thEnd[0] : thEnd[1];
    }

    let _setPointsRanges = JSON.parse(JSON.stringify(setPointsRanges));
    _setPointsRanges[idxRange] = {
      ..._setPointsRanges[idxRange],
      start,
      end,
      workMode,
      skipCheck,
      error,
    };

    //se l'attuale intervallo è legato ad un altro
    if (prevLinkRange != undefined) {
      _setPointsRanges[prevLinkRange] = {
        ..._setPointsRanges[prevLinkRange],
        end: start || 24,
      };
    }
    if (nextLinkRange != undefined) {
      _setPointsRanges[nextLinkRange] = {
        ..._setPointsRanges[nextLinkRange],
        start: end || 0,
      };
    }

    _setPointsRanges = thresholdManager(_setPointsRanges);

    setSetPointsRanges(_setPointsRanges);
  };

  const makeDailySchedule = (current_dailySchedule, setPointsRanges) => {
    let newDailySchedule = JSON.parse(JSON.stringify(current_dailySchedule));
    newDailySchedule.map((schedule)=>{
      const range = setPointsRanges.find((r)=> r.start <= +schedule.hour && +schedule.hour < r.end);
      schedule.workMode = range.workMode;
      schedule.setPoint = worksMode[range.workMode];
    })
    onSave(newDailySchedule)
  }

  const saveHandler = ()=>{
    makeDailySchedule(dailySchedule, setPointsRanges)
  }

  React.useEffect(() => {
    if (!open) {
    }
  }, [open]);

  return (
    <ConfigDialog
      title={title}
      open={open}
      description={description}
      onClose={onClose}
      onSave={saveHandler}
    >
      <Stack mt={2} height={700}>
        {setPointsRanges.map((setPoint, idxRange) => (
          <Stack key={idxRange} mb={5} direction={"row"}>
            <Stack justifyContent={"space-around"} mr={2}>
              {setPointsRanges.length > 1 && (
                <IconButton
                  sx={{ padding: 0 }}
                  onClick={() => removeInterval(setPoint.position)}
                >
                  <RemoveIcon />
                </IconButton>
              )}
              <IconButton
                sx={{ padding: 0 }}
                disabled={!setPoint.canSplitInterval}
                onClick={() => splitInterval(setPoint.position)}
              >
                <AddIcon />
              </IconButton>
            </Stack>
            <Stack width={"100%"}>
              <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <FormControl sx={{ m: 1, width: 120 }} size="small">
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={setPoint.workMode}
                    onChange={(e) =>
                      handleSetPointsRanges(
                        idxRange,
                        e.target.value,
                        setPoint.start,
                        setPoint.end,
                        idxRange === 0
                      )
                    }
                  >
                    {Object.keys(worksMode)?.map((key) => (
                      <MenuItem key={key} value={key}>
                        {workModeConfig[key]?.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography variant="h6">
                  Dalle{" "}
                  <span style={{ fontWeight: "bold" }}>{setPoint.start}</span>{" "}
                  alle{" "}
                  <span style={{ fontWeight: "bold" }}>{setPoint.end}</span>
                </Typography>
              </Stack>
              <SliderComponent
                rangeColor={workModeConfig[setPoint.workMode].color}
                min={0}
                max={24}
                step={1}
                colorFirstThumb={
                  setPoint.start === 0
                    ? workModeConfig[setPoint.workMode].color
                    : null
                }
                colorSecondThumb={
                  setPoint.end === 24
                    ? workModeConfig[setPoint.workMode].color
                    : null
                }
                value={[setPoint.start, setPoint.end]}
                thumbsDisabled={[false, false]}
                rangeSlideDisabled={true}
                onInput={(range) =>
                  handleSetPointsRanges(
                    idxRange,
                    setPoint.workMode,
                    range[0],
                    range[1],
                    idxRange === 0
                  )
                }
              />
            </Stack>
          </Stack>
        ))}
      </Stack>
    </ConfigDialog>
  );
}

export default ConfigSetPointDialog;
