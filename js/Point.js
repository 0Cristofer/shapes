class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    scaleRelativeTo(sx, sy, p){
        let scale_factor;
        let dist;

        scale_factor = new Point(this.x - p.x, this.y - p.y);
        dist = new Point(scale_factor.x, scale_factor.y);

        scale_factor.x = scale_factor.x*sx;
        scale_factor.y = scale_factor.y*sx;

        Point.subPointsInPlace(dist, scale_factor);
        Point.sumPointsInPlace(p, dist);
    }

    rotatePoint(degs, axis){
        let cos;
        let sin;
        let new_x;
        let new_y;

        if(!axis){
            axis = new Point(0, 0);
        }

        cos = Math.cos(toRadians(degs));
        sin = Math.sin(toRadians(degs));

        new_x = Math.ceil(this.x*cos - this.y*sin + (axis.y*sin - axis.x*cos + axis.x));
        new_y = Math.ceil(this.x*sin + this.y*cos + (-1*axis.x*sin - axis.y*cos + axis.y));

        this.x = new_x;
        this.y = new_y;
    }

    translateTo(dist){
        Point.sumPointsInPlace(this, dist);
    }

    makeasDistance(){
        this.x = this.x < 0 ? this.x*-1 : this.x;
        this.y = this.y < 0 ? this.y*-1 : this.y;
    }

    static sumPoints(a, b){
        return new Point(a.x + b.x, a.y + b.y);
    }

    static sumPointsInPlace(a, b){
        a.x = a.x + b.x;
        a.y = a.y + b.y;
    }

    static subPoints(a, b){
        return new Point(a.x - b.x, a.y - b.y);
    }

    static subPointsInPlace(a, b){
        a.x = a.x - b.x;
        a.y = a.y - b.y;
    }

    static compPoints(a, b){
        return (a.x === b.x) && (a.y === b.y);
    }

    static dotProduct(a, b){
        return a.x*b.x + a.y*b.y;
    }

    static calcDist(a, b){
        if(!b){
            b = new Point(0, 0);
        }
        return Math.ceil(Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)));
    }

    static findNearest(p, a, b){
        let dist;
        let shortest;
        let nearest;
        let is_array = !!a.length;

        if(is_array){
            nearest = [];
            shortest = Point.calcDist(a[0], p);
            nearest.push(a[0]);
            for(let i = 1; i < a.length; i++){
                nearest.push(a[i]);
                dist = Point.calcDist(a[i], p);

                if(shortest > dist){
                    shortest = dist;

                    nearest[nearest.length-1] = nearest[0];
                    nearest[0] = a[i];
                }
            }
        }
        else {

            shortest = Point.calcDist(a, p);
            nearest = a;

            dist = Point.calcDist(b, p);
            if (shortest > dist) {
                nearest = [b, a];
            }
            else {
                nearest = [a, b];
            }
        }

        return nearest;
    }

    zoomPoint(){
        return new Point(Math.ceil((this.x - window_start.x)*window_scale.x + viewport_start.x),
        Math.ceil((this.y - window_start.y)*window_scale.y + viewport_start.y))
    }

    toCanvasPos(){
        return new Point(this.x, VIEWPORT_SIZE-this.y);
    }

    toWorldPos(){
        return Point.sumPoints(new Point(Math.ceil(this.x/window_scale.x),
            Math.ceil((VIEWPORT_SIZE-this.y)/window_scale.y)), window_start);
    }
}