export class NavBarMenu{
  text!: string;
  type: 'button' | 'dropdown' = 'button';
  class: string = 'btn btn-primary';
  disabled!: any;
  icon: string | null = null;
  iconType: string | null = null;
  visible: boolean;
  onClick: () => void;
  pulse?: boolean;
  items: NavBarMenu[] = [];
  constructor() {
    this.pulse = false;
  }
}

export class NavBarIcon{
  constructor(
    public icon: string,
    public iconClass?: string,
    public width?: number,
    public height?: number,
    public type?: string,
  ) {
    this.icon = icon;
    this.iconClass = iconClass === undefined ? '' : iconClass;
    this.width = width === undefined ? 24 : width;
    this.height = height === undefined ? 24 : height;
    this.type = type === undefined ? 'duotone' : type;
  }
}
export class NavBarText{
  constructor(
    public text: string,
    public textClass?: string,
  ) {
    this.text = text;
    this.textClass = textClass === undefined ? '' : textClass;
  }
}

export class NavBarOption{
  constructor(
    public icon?: null | string | NavBarIcon,
    public start?: boolean,
    public title?: string | null | NavBarText,
    public subtitle?: string | null | NavBarText,
    public menu: NavBarMenu[] = []
  ) {
    this.icon = icon === undefined ? null : icon;
    this.start = start === undefined ? false : start;
    this.title = title === undefined ? null : title;
    this.subtitle = subtitle === undefined ? null : subtitle;
    this.menu = menu;
  }
}
