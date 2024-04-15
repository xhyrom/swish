export namespace database {
	
	export class Track {
	    id: number;
	    video_id: string;
	    from_user?: string;
	    to_user?: string;
	
	    static createFrom(source: any = {}) {
	        return new Track(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.video_id = source["video_id"];
	        this.from_user = source["from_user"];
	        this.to_user = source["to_user"];
	    }
	}

}

