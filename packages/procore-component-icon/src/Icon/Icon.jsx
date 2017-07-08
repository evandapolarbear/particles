import React from 'react';
import PropTypes from 'prop-types';
import QaTag from '@procore/qa-tag';
import cx from 'classnames';

const ICON_CLASSES = {
  'arrow-left': 'fa fa-arrow-left',
  'arrow-right': 'fa fa-arrow-right',
  'caret-down': 'fa fa-caret-down',
  'caret-left': 'fa fa-caret-left',
  'caret-right': 'fa fa-caret-right',
  'caret-up': 'fa fa-caret-up',
  'check-circle-o': 'fa fa-check-circle-o',
  'check-circle': 'fa fa-check-circle',
  'chevron-down': 'fa fa-chevron-down',
  'chevron-left': 'fa fa-chevron-left',
  'chevron-right': 'fa fa-chevron-right',
  'chevron-thin-down': 'fa fa-angle-down',
  'chevron-thin-left': 'fa fa-angle-left',
  'chevron-thin-right': 'fa fa-angle-right',
  'chevron-thin-up': 'fa fa-angle-up',
  'chevron-up': 'fa fa-chevron-up',
  'circle-o': 'fa fa-circle-o',
  'drag-handle': 'fa fa-bars draggable',
  'file-image': 'fa fa-file-image-o',
  'folder-open': 'fa fa-folder-open',
  'pc-add': 'pcicon pcicon-add',
  'pc-admin': 'pcicon pcicon-admin',
  'pc-arrow-alt': 'pcicon pcicon-arrow-alt',
  'pc-arrow-left-fill': 'pcicon pcicon-arrow-left-fill',
  'pc-arrow-left': 'pcicon pcicon-arrow-left',
  'pc-arrow-right-fill': 'pcicon pcicon-arrow-right-fill',
  'pc-arrow-right': 'pcicon pcicon-arrow-right',
  'pc-arrows': 'pcicon pcicon-arrows',
  'pc-ban': 'pcicon pcicon-ban',
  'pc-bidding': 'pcicon pcicon-bidding',
  'pc-buildings': 'pcicon pcicon-buildings',
  'pc-calculator': 'pcicon pcicon-calculator',
  'pc-calendar': 'pcicon pcicon-calendar',
  'pc-camera': 'pcicon pcicon-camera',
  'pc-caret-down': 'pcicon pcicon-caret-down',
  'pc-caret-o-left': 'pcicon pcicon-caret-o-left',
  'pc-caret-o-right': 'pcicon pcicon-caret-o-right',
  'pc-caret-up': 'pcicon pcicon-caret-up',
  'pc-change-events': 'pcicon pcicon-change-events',
  'pc-checkmark': 'pcicon pcicon-checkmark',
  'pc-chevron-down': 'pcicon pcicon-chevron-down',
  'pc-chevron-left': 'pcicon pcicon-chevron-left',
  'pc-chevron-right': 'pcicon pcicon-chevron-right',
  'pc-chevron-up': 'pcicon pcicon-chevron-up',
  'pc-clock': 'pcicon pcicon-clock',
  'pc-commitments': 'pcicon pcicon-commitments',
  'pc-copy': 'pcicon pcicon-copy',
  'pc-count-badge': 'pcicon pcicon-count-badge',
  'pc-daily-log': 'pcicon pcicon-daily-log',
  'pc-delete': 'pcicon pcicon-delete',
  'pc-desktop': 'pcicon pcicon-desktop',
  'pc-directory': 'pcicon pcicon-directory',
  'pc-download-two': 'pcicon pcicon-download-two',
  'pc-drawings': 'pcicon pcicon-drawings',
  'pc-edit': 'pcicon pcicon-edit',
  'pc-ellipsis-v': 'pcicon pcicon-ellipsis-v',
  'pc-ellipsis': 'pcicon pcicon-ellipsis-v rotate-90',
  'pc-email': 'pcicon pcicon-email',
  'pc-file-locked': 'pcicon pcicon-file-locked',
  'pc-file': 'pcicon pcicon-file',
  'pc-folder-locked': 'pcicon pcicon-folder-locked',
  'pc-folder-open': 'pcicon pcicon-folder-open',
  'pc-folder': 'pcicon pcicon-folder',
  'pc-inbox': 'pcicon pcicon-inbox',
  'pc-info': 'pcicon pcicon-info',
  'pc-inspections': 'pcicon pcicon-inspections',
  'pc-lock': 'pcicon pcicon-lock',
  'pc-logout': 'pcicon pcicon-logout',
  'pc-menu': 'pcicon pcicon-menu',
  'pc-minus': 'pcicon pcicon-minus',
  'pc-notifications': 'pcicon pcicon-notifications',
  'pc-paper-clip': 'pcicon pcicon-paper-clip',
  'pc-pdf': 'pcicon pcicon-pdf',
  'pc-photo-markup': 'pcicon pcicon-photo-markup',
  'pc-photos': 'pcicon pcicon-photos',
  'pc-play': 'pcicon pcicon-play',
  'pc-prime-contract': 'pcicon pcicon-prime-contract',
  'pc-punch-list': 'pcicon pcicon-punch-list',
  'pc-question-circle': 'pcicon pcicon-question-circle',
  'pc-refresh': 'pcicon pcicon-refresh',
  'pc-reply-all': 'pcicon pcicon-reply-all',
  'pc-reports': 'pcicon pcicon-reports',
  'pc-rfi': 'pcicon pcicon-rfi',
  'pc-save': 'pcicon pcicon-save',
  'pc-search': 'pcicon pcicon-search',
  'pc-settings': 'pcicon pcicon-settings',
  'pc-share': 'pcicon pcicon-share',
  'pc-specs': 'pcicon pcicon-specs',
  'pc-star-o': 'pcicon pcicon-star-o',
  'pc-star': 'pcicon pcicon-star',
  'pc-submittals': 'pcicon pcicon-submittals',
  'pc-suitcase': 'pcicon pcicon-suitcase',
  'pc-table': 'pcicon pcicon-table',
  'pc-tag': 'pcicon pcicon-tag',
  'pc-tags': 'pcicon pcicon-tags',
  'pc-times': 'pcicon pcicon-times',
  'pc-transmittals': 'pcicon pcicon-transmittals',
  'pc-trash': 'pcicon pcicon-trash',
  'pc-unlock': 'pcicon pcicon-unlock',
  'pc-upload-two': 'pcicon pcicon-upload-two',
  'pc-upload': 'pcicon pcicon-upload',
  'pc-user': 'pcicon pcicon-user',
  'pc-warning': 'pcicon pcicon-warning',
  'pc-wrench': 'pcicon pcicon-wrench',
  'share-square': 'fa fa-share-square-o',
  'sheet-options': 'fa fa-ellipsis-v',
  'sign-out': 'fa fa-sign-out',
  'thin-carrot': 'pct-icon carrot',
  'trash-solid': 'fa fa-trash',
  add: 'fa fa-plus',
  'arrows-h': 'fa fa-arrows-h',
  attachment: 'fa pct-icon attachment',
  binoculars: 'pct-icon binoculars',
  bolt: 'fa fa-bolt',
  briefcase: 'fa fa-briefcase',
  building: 'fa fa-building',
  calculator: 'fa fa-calculator',
  calendar: 'fa fa-calendar',
  camera: 'fa fa-camera',
  cellphone: 'fa fa-mobile-phone',
  check: 'fa fa-check',
  circle: 'fa fa-circle',
  clear: 'pct-icon clear',
  close: 'fa fa-ban',
  cog: 'fa fa-cog',
  comment: 'fa pct-icon comment',
  computer: 'fa fa-desktop',
  delete: 'fa fa-times-circle',
  dismiss: 'fa fa-times',
  download: 'fa fa-download',
  edit: 'fa fa-edit',
  ellipsis: 'fa fa-ellipsis-h',
  email: 'fa fa-envelope',
  exclamation: 'fa fa-exclamation-circle',
  file: 'fa fa-file-o',
  files: 'fa fa-files-o',
  folder: 'fa fa-folder',
  gavel: 'fa fa-gavel',
  gear: 'fa fa-gear',
  info: 'fa fa-info-circle',
  loading: 'fa fa-circle-o-notch fa-spin',
  'map-marker': 'fa fa-map-marker',
  paperclip: 'fa fa-paperclip',
  pdf: 'fa fa-file-pdf-o',
  pencil: 'fa fa-pencil',
  person: 'pct-icon-set user',
  photo: 'fa pct-icon photo',
  picture: 'fa fa-picture-o',
  print: 'fa fa-print',
  private: 'fa fa-lock',
  question: 'fa fa-question-circle ',
  retrieve: 'fa fa-undo',
  search: 'fa fa-search',
  share: 'fa fa-share',
  sliders: 'fa fa-sliders',
  spinner: 'fa fa-spinner',
  star: 'fa fa-star-o',
  starred: 'fa fa-star',
  status: 'fa pct-icon status',
  times: ' fa fa-times',
  trash: 'fa fa-trash-o',
  unlock: 'fa fa-unlock-alt',
  user: 'fa fa-user',
  users: 'pct-icon-set users',
  warning: 'fa fa-warning',
  wrench: 'fa fa-wrench',
};

const Icon = ({className, disabled, icon, clickable}) => {
  const iconClass = cx(
    ICON_CLASSES[icon],
    className,
    {
      disabled,
      clickable,
    },
  );

  return (
    <QaTag tag={`icon_${icon}`}>
      <i  className={iconClass} />
    </QaTag>
  );
}

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  clickable: PropTypes.bool,
};

Icon.defaultProps = {
  clickable: true,
  disabled: false,
};

export default Icon;
