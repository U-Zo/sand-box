const a = new Intl.NumberFormat('ko', {
  notation: 'compact',
});

console.log(a.format(1000));

export {};
