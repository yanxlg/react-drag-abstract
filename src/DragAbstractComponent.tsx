/**
 * @disc:可拖动抽象组件
 * @author:yanxinaliang
 * @time：2018/6/20 14:20
 */
import * as React from "react";

declare const window:any;

export declare interface IDragAbsoluteComponentProps{
    onDragStart?:(startPoint:any,element?:HTMLElement)=>void;
    onDragMove?:(delPosition:any,element?:HTMLElement)=>void;
    onDragEnd?:(delPosition:any,element?:HTMLElement)=>void;
    onResize?:(delPosition:any,element?:HTMLElement)=>void;
    resizeClassName?:string;//rezise元素拥有的样式，仅支持单节点，不支持复合节点
}

class DragAbstractComponent<T extends IDragAbsoluteComponentProps,M={}> extends React.Component<T,M>{
    private drag:boolean=false;
    private _beforePoint:any;
    public element:HTMLDivElement;
    private resize:boolean=false;
    private resizeClassName:string|undefined;
    constructor(props:T){
        super(props);
        this.resizeClassName=props.resizeClassName;
    }
    private dragStartListener=(e:any)=>{
        const target =e.target||window.event.srcElement;
        this._beforePoint={
            x:e.clientX,
            y:e.clientY
        };
        if(this.resizeClassName&&new RegExp(this.resizeClassName).test(target.className)){
            //resize
            this.resize=true;
            this.drag=false;
            //resizeStart
        }else{
            this.drag=true;
            this.resize=false;
            this.props.onDragStart&&this.props.onDragStart(this._beforePoint,this.element);
        }
    };
    private dragMoveListener=(e:any)=>{
        if(this.drag){
            const delPos={
                x:e.clientX-this._beforePoint.x,
                y:e.clientY-this._beforePoint.y,
            };
            this._beforePoint={
                x:e.clientX,
                y:e.clientY
            };
            this.props.onDragMove&&this.props.onDragMove(delPos,this.element);
        }
        if(this.resize){
            const delPos={
                x:e.clientX-this._beforePoint.x,
                y:e.clientY-this._beforePoint.y,
            };
            this._beforePoint={
                x:e.clientX,
                y:e.clientY
            };
            this.props.onResize&&this.props.onResize(delPos,this.element);
        }
    };
    private dragEndListener=(e:any)=>{
        if(this.drag){
            const delPos={
                x:e.clientX-this._beforePoint.x,
                y:e.clientY-this._beforePoint.y,
            };
            this._beforePoint={
                x:e.clientX,
                y:e.clientY
            };
            this.props.onDragEnd&&this.props.onDragEnd(delPos,this.element);
        }
        if(this.resize){
            const delPos={
                x:e.clientX-this._beforePoint.x,
                y:e.clientY-this._beforePoint.y,
            };
            this._beforePoint={
                x:e.clientX,
                y:e.clientY
            };
            this.props.onResize&&this.props.onResize(delPos,this.element);
        }
        this.drag=false;
        this.resize=false;
    };
    private dragCancelListener=()=>{
        this.drag=false;
        this.resize=false;
    };
    
    componentDidMount(){
        if("ontouchstart" in document){
            this.element.addEventListener("touchstart",this.dragStartListener);
            this.element.addEventListener("touchmove",this.dragMoveListener);
            this.element.addEventListener("touchend",this.dragEndListener);
            this.element.addEventListener("touchcancel",this.dragCancelListener);
        }else{
            this.element.addEventListener("mousedown",this.dragStartListener);
            window.addEventListener("mousemove",this.dragMoveListener);
            window.addEventListener("mouseup",this.dragEndListener);
            // this.element.addEventListener("mouseout",this.dragCancelListener);
        }
    }
    componentWillUnmount(){
        if("ontouchstart" in document){
            this.element.removeEventListener("touchstart",this.dragStartListener);
            this.element.removeEventListener("touchmove",this.dragMoveListener);
            this.element.removeEventListener("touchend",this.dragEndListener);
            this.element.removeEventListener("touchcancel",this.dragEndListener);
        }else{
            this.element.removeEventListener("mousedown",this.dragStartListener);
            window.removeEventListener("mousemove",this.dragMoveListener);
            window.removeEventListener("mouseup",this.dragEndListener);
            // this.element.removeEventListener("mouseout",this.dragCancelListener);
        }
    }
}

export default DragAbstractComponent;