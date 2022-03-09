
  const padLeft = (text = '', maxLength = 13) =>
    text.length < maxLength
      ? new Array(maxLength - text.length).fill(' ').join('') + text
      : text.substr(0, maxLength);

  const padRight = (text = '', maxLength = 13) =>
    text.length < maxLength
      ? text + new Array(maxLength - text.length).fill(' ').join('')
      : text.substr(text.length - maxLength);

  const fillDash = (length: any) => new Array(length).fill('-').join('');

  const getLines = (columns: any) =>
    fillDash(
      columns.reduce((sum: any, col: any) => (col.width ?? 10) + sum, 0) +
        columns.length -
        1,
    );

  const getCol = (
    { align = 'left', width = 10, dataIndex='', prefix = '', suffix = '' },
    row:any  ,
  ) => {
    const pad = align === 'right' ? padLeft : padRight;
    return pad(prefix + row[dataIndex] + suffix, width);
  };

  const getRow = (columns:any, row:any) => {
    if (row === '-') return getLines(columns);
    return columns.map((column:any) => getCol(column, row)).join(' ');
  };

  const getHeaderCol = ({ align = 'left', width = 10, title='' }) => {
    const pad = align === 'right' ? padLeft : padRight;
    return pad(title, width);
  };

  const getHeaderRow = (columns:any) => {
    return columns.map((column:any) => getHeaderCol(column)).join(' ');
  };

  const slackTable = ({ title = '', columns = [{}], dataSource = [{}] }) => {

    return (
      `*${title}*\n` +
      '```' +
      [
        getHeaderRow(columns),
        ...dataSource.map((row) => getRow(columns, row)),
      ].join('\n') +
      '```'
    );
  };

  export { slackTable}