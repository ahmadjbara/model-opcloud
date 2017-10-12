export const haloConfig = {
  handles: [
    {
      name: 'remove',
      position: 'nw',
      events: { pointerdown: 'removeElement' },
      attrs: {
        '.handle': {
          'data-tooltip-class-name': 'small',
          'data-tooltip': 'Click to remove the object',
          'data-tooltip-position': 'right',
          'data-tooltip-padding': 15
        }
      }
    }
  ]
};
