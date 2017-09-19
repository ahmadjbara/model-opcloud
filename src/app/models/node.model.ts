/**
 * Created by sameh14 on 5/26/2017.
 */
export class Node {
  id: string = '';
  name: string = '';
  className: string = 'root-class';
  expanded: boolean = true;
  isHidden: boolean = false;
  hasChildren: boolean = false;
  hasParent: boolean = false;
  parent: string;
  children: Node[] = [];
  graph: string='';
  type:string='';
  constructor(node: any) {
    this.id = node.id;
    this.name = node.name || '';
    this.className = node.className || '';
    this.expanded = node.expanded || false;
    this.isHidden = node.isHidden || false;
    this.hasParent = node.hasParent || false;
    this.parent = node.parent || 'SD';
    this.hasChildren = node.hasChildren || false;
    this.children = node.children || [];
    this.graph = node.graph || '';
    this.type = node.type || '';
  }

  public addChildren(children) {
    this.children.push(children);
  }
}
