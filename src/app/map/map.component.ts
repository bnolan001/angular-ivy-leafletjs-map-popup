import { Component, OnInit, ComponentFactoryResolver, Injector, ApplicationRef } from "@angular/core";
import * as L from "leaflet";
import { CustomPopupComponent } from "../custom-popup/custom-popup.component";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"]
})
export class MapComponent implements OnInit {
  map: L.Map;

  constructor(
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector) {
  }

  ngOnInit() {
    // Initialize the map to display Europe
    this.map = L.map('map', {
      center: [49.8282, 8.5795],
      zoom: 4,
      minZoom: 1,
      maxZoom: 10
    }) // Create a callback for when the user changes the zoom
    .addEventListener("zoomlevelschange", this.onZoomChange, this)
     // Create a callback for when the map is moved
    .addEventListener("moveend", this.onCenterChange, this);

    // Define where we are going to get the actual map
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

/**
 * Event callback for when the center of the map changes
 */
  onCenterChange(event: any) {
    console.debug(`MapComponent:onCenterChange: Starting`);
    // Retrieve the new map boundaries 
    let mapBoundary: L.LatLngBounds = this.map.getBounds();
    console.debug(`MapComponent:onCenterChange: Boundary: ${JSON.stringify(mapBoundary)}`);
    // Retrieve the new center coordinates
    let latLng: L.LatLng = event.sourceTarget.getCenter();
    console.debug(`MapComponent:onCenterChange: Lat: ${latLng.lat}, Lng: ${latLng.lng}`);
  }

/**
 * Event callback for when the zoom level changes
 */
  onZoomChange(event: any) {
    console.debug(`MapComponent:onZoomChange: Starting`);
    // Retrieve the new map boundaries 
    let mapBoundary: L.LatLngBounds = this.map.getBounds();
    console.debug(`MapComponent:onZoomChange: Boundary: ${JSON.stringify(mapBoundary)}`);
  }

/**
 * Center the map on the set Latitude and Longitude
 */
  centerMap(lat: number, lng: number): void {
    // Move the center of the map to the new location
    this.map.panTo([lat, lng]);
    // Build the component for showing in the marker popup
    let markerPopup: any = this.compilePopup(CustomPopupComponent, 
      (c) => {c.instance.customText = 'Custom Data Injection'});
    // Generate a circle marker for this location
    let currentLocation: L.CircleMarker = L.circleMarker([lat, lng], {
      radius: 5
    })
    // Add a binding for the popup to show a custom component
    // instead of the standard leaflet popup
    .bindPopup(markerPopup);
    currentLocation.addTo(this.map);
    // Wait a short period before zooming to a designated level
    setTimeout(() => {this.map.setZoom(8);}, 750);
  }

  // https://github.com/darkguy2008/leaflet-angular4-issue/blob/master/src/app.ts
  /**
   * Builds the referenced component so it can be injected into the 
   * leaflet map as popup.
   */
  private compilePopup(component, onAttach): any {
    const compFactory: any = this.resolver.resolveComponentFactory(component);
    let compRef: any = compFactory.create(this.injector);

    // onAttach allows you to assign 
    if (onAttach)
      onAttach(compRef);

    this.appRef.attachView(compRef.hostView);
    compRef.onDestroy(() => this.appRef.detachView(compRef.hostView));
    
    let div = document.createElement('div');
    div.appendChild(compRef.location.nativeElement);
    return div;
  }
}
