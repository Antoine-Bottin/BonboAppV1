export default function (listActivities = [], action) {
  if (action.type === 'listActivities') {
    return action.data;
  } else {
    return listActivities;
  }
}