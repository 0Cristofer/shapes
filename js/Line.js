class Line{
    constructor(a, b, id){
        this.id = id;
        this.name = "Linha";
        this.cor = '#ffffff';

        this.a = a;
        this.b = b;

        this.near_origin = this.findNearest();
    }

    findNearest(p){
        let dist;
        let shortest;
        let nearest;

        if(!p){
            p = new Point(0, 0);
        }

        shortest = Point.calcDist(this.a, p);
        nearest = this.a;

        dist = Point.calcDist(this.b, p);
        if(shortest > dist){
            nearest = this.b;
        }

        return nearest;
    }

    findLowestHighestX(){
        let lowest = this.a.x;
        let highest = this.a.x;

        if(this.b.x < lowest){
            lowest = this.b.x;
        }

        if(this.b.x > highest){
            highest = this.b.x;
        }

        return [lowest, highest];
    }

    findLowestHighestY(){
        let lowest = this.a.y;
        let highest = this.a.y;

        if(this.b.y < lowest){
            lowest = this.b.y;
        }

        if(this.b.y > highest){
            highest = this.b.y;
        }

        return [lowest, highest];
    }

    zoomPoints(){
        this.a.zoomPoint();
        this.b.zoomPoint();
    }

    draw(context, viewport, scale){
        context.beginPath();
        context.moveTo(this.a.zoomPoint().toCanvasPos().x , this.a.zoomPoint().toCanvasPos().y);
        context.lineTo(this.b.zoomPoint().toCanvasPos().x , this.b.zoomPoint().toCanvasPos().y);
        context.strokeStyle = this.cor;
        context.stroke();
    }

    getPontosString(){
        return "(A: " + this.a.x + ", " + this.a.y + "; B: " + this.b.x + ", " + this.b.y + ")";
    }
}