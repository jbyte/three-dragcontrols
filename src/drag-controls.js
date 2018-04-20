let THREE;
let _plane;
let _raycaster;
let _mouse;
let _offset;
let _intersection;
let _selected;
let _hovered;

export default class DragControls {

    static install(lib) {
        THREE = lib.THREE;
        _plane = new THREE.Plane();
        _raycaster = new THREE.Raycaster();
        _mouse = new THREE.Vector2();
        _offset = new THREE.Vector3();
        _intersection = new THREE.Vector3();
        _selected = null;
        _hovered = null;

        DragControls.prototype = Object.create(THREE.EventDispatcher.prototype);
    }

    constructor(objects, camera, domElement) {
        this.objects = objects;
        this.enabled = true;
        this.camera = camera;
        this.domElement = domElement;
        var scope = this;

        this.activate = () => {
            if(!this.domElement) {
                console.log("Cannot activate the drag controls on a null DOM element");
                return;
            }
            this.domElement.addEventListener("mousedown", onDocumentMouseDown, false);
            this.domElement.addEventListener("mousemove", onDocumentMouseMove, false);
            this.domElement.addEventListener("mouseup", onDocumentMouseCancel, false);
            this.domElement.addEventListener("mouseleave", onDocumentMouseCancel, false);
            this.domElement.addEventListener("touchstart", onDocumentTouchStart, false);
            this.domElement.addEventListener("touchmove", onDocumentTouchMove, false);
            this.domElement.addEventListener("touchend", onDocumentTouchEnd, false);
        };

        this.deactivate = () => {
            if(!this.domElement) {
                console.log("Cannot deactivate the drag controls on a null DOM element");
                return;
            }
            this.domElement.removeEventListener("mousedown", onDocumentMouseDown, false);
            this.domElement.removeEventListener("mousemove", onDocumentMouseMove, false);
            this.domElement.removeEventListener("mouseup", onDocumentMouseCancel, false);
            this.domElement.removeEventListener("mouseleave", onDocumentMouseCancel, false);
            this.domElement.removeEventListener("touchstart", onDocumentTouchStart, false);
            this.domElement.removeEventListener("touchmove", onDocumentTouchMove, false);
            this.domElement.removeEventListener("touchend", onDocumentTouchEnd, false);
        };

        function onDocumentMouseDown(event) {
            event.preventDefault();

            _raycaster.setFromCamera(_mouse, scope.camera);

            var intersects = _raycaster.intersectObjects(scope.objects);
            if(intersects.length > 0) {
                _selected = intersects[0].object;
                if(_raycaster.ray.intersectPlane(_plane, _intersection)) {
                    _offset.copy(_intersection).sub(_selected.position);
                }
                scope.domElement.style.cursor = "move";
                scope.dispatchEvent({type: "dragstart", object: _selected});
            }
        }

        function onDocumentMouseMove(event) {
            event.preventDefault();

            var rect = scope.domElement.getBoundingClientRect();

            _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            _raycaster.setFromCamera(_mouse, scope.camera);

            if(_selected && scope.enabled) {
                if(_raycaster.ray.intersectPlane(_plane, _intersection)) {
                    _selected.position.copy(_intersection.sub(_offset));
                }

                scope.dispatchEvent({type: "drag", object: _selected});
                return;
            }

            _raycaster.setFromCamera(_mouse, scope.camera);

            var intersects = _raycaster.intersectObjects(scope.objects);
            if(intersects.length > 0) {
                var object = intersects[0].object;
                _plane.setFromNormalAndCoplanarPoint(scope.camera.getWorldDirection(_plane.normal), object.position);

                if(_hovered !== object) {
                    scope.dispatchEvent({type: "hoveron", object: object});

                    scope.domElement.style.cursor = "pointer";
                    _hovered = object;
                }
            } else {
                if(_hovered !== null) {
                    scope.dispatchEvent({type: "hoveroff", object: _hovered});

                    scope.domElement.style.cursor = "auto";
                    _hovered = null;
                }
            }
        }

        function onDocumentMouseCancel(event) {
            event.preventDefault();

            if(_selected) {
                scope.dispatchEvent({type: "dragend", object: _selected});
                _selected = null;
            }

            scope.domElement.style.cursor= "auto";
        }

        function onDocumentTouchStart(event) {
            event.preventDefault();
            event = evnet.changedTouches[0];

            var rect = scope.domElement.getBoundingClientRect();

            _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            _mouse.y = -((event.clientY - rect.top) /rect.height) * 2 + 1;

            _raycaster.setFromCamera(_mouse, scope.camera);
            var intersects = _raycaster.intersectObjects(scope.objects);
            if(intersects.length > 0) {
                _selected = intersects[0].object;
                _plane.setFromNormalAndCoplanarPoint(scope.camera.getWorldDirection(_plane.normal), _selected.position);
                if(_raycaster.ray.intersectPlane(_plane, _intersection)) {
                    _offset.copy(_intersection).sub(_selected.position);
                }
                scope.domElement.style.cursor = "move";
                scope.dispatchEvent({type: "dragstart", object: _selected});
            }
        }

        function onDocumentTouchMove(event) {
            event.preventDefault();
            event = event.changedTouches[0];

            var rect = scope.domElement.getBoundingClientRect();

            _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            _raycaster.setFromCamera(_mouse, scope.camera);
            if(_selected && scope.enabled) {
                if(_raycaster.ray.intersectPlane(_plane, _intersection)) {
                    _selected.position.copy(_intersection.sub(_offset));
                }
                scope.dispatchEvent({type: "drag", object: _selected});
                return;
            }
        }

        function onDocumentTouchEnd(event) {
            event.preventDefault();

            if(_selected) {
                scope.dispatchEvent({type: "dragend", object: _selected});o
                _selected = null;
            }

            scope.domElement.style.cursor = "auto";
        }

        this.activate();
    }
}
