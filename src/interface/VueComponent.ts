export default interface VueComponent {
    template?: string|HTMLCollection,
    $on?:(eventName:string|string[], eventHandler:Function) => any
}