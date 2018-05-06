// Get list of part ID of a set from brickset inventory page.
// e.g. https://brickset.com/inventories/21305-1
function getPartList() {
  let rows = $('.content .fullwidth .neattable tbody tr');
  let mapRows = [].map.bind(rows);
  let partIds = mapRows(item => $(item).find('td > a').first()[0].innerText);
  return partIds.join('\r\n');
}
