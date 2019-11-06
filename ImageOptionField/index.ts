import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as $ from 'jquery';
//import { PCFImageControlSettings } from "./PCFImageControlSettings";

interface PCFImageControlSettings {
    fieldValue: string | null;
    filePath: string | null;
    fileType: string | null;

    spaceReplace: string | null;
    imageHeight: string | null;
    imageWidth: string | null;
}


export class ImageOptionField implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    
    private context: ComponentFramework.Context<IInputs>;
    private container: HTMLDivElement;
    private notifyOutputChanged: () => void;

    private settings: PCFImageControlSettings;
    private clientUrl: any;

    private imageContainer: HTMLDivElement;
    private image: HTMLImageElement;

    private supportedFileTypes: string[] = ["png", "jpg", "jpeg", "gif"];


    private fieldValue: string;
    private filePath: string;
    private fileType: string | null;

    private spaceReplace: string;
    private imageHeight: number;
    private imageWidth: number;

	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
        this.context = context;
        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;

        this.clientUrl = (<any>context).page.getClientUrl();
        //this.clientUrl = 'https://i.imgur.com/';

        this.imageContainer = document.createElement("div");
        this.imageContainer.classList.add("imageOptionField");

        this.image = document.createElement("img");
        this.image.classList.add("optionImage");


        //this.image.src = this.createPath(this.settings);
        //this.image.src = 'http://511bingo.site/images/511bingologo.png';

        this.generateImage(context);

        this.image.addEventListener("change", () => {
            this.notifyOutputChanged();
        })

        this.imageContainer.appendChild(this.image);

        this.container.appendChild(this.imageContainer);

    }

    private validateInputs(context: ComponentFramework.Context<IInputs>) {
        this.fieldValue = context.parameters.fieldValue.formatted || '';
        this.filePath = context.parameters.filePath.raw || '';
        this.fileType = this.supportedFileTypes.indexOf(context.parameters.filePath.raw!) > -1 ?
            (context.parameters.fileType === undefined ? "png" : context.parameters.filePath.raw)
            : "png";

        this.spaceReplace = context.parameters.spaceReplace.raw || '';
        this.imageHeight = context.parameters.imageHeight.raw || -1;
        this.imageWidth = context.parameters.imageWidth.raw || -1;
    }

    private generateImage(context: ComponentFramework.Context<IInputs>) {

        this.validateInputs(context);

        this.image = this.createPath(this.image, this.filePath!, this.fieldValue!, this.fileType!, this.spaceReplace);
        this.image = this.assignImageDimensions(this.image, this.imageHeight, this.imageWidth);
    }

    private createPath(image: HTMLImageElement, filePath: string, fieldValue: string, fileType: string, spaceReplace: string): HTMLImageElement {
        if (!filePath) {
            return image;
        }

        if (!spaceReplace) {
            let fileName = fieldValue.replace(/\s+/g, '');
            image.src = this.clientUrl + filePath + fileName + "." + fileType;
        }
        else {
            let fileName = fieldValue.replace(/\s+/g, spaceReplace);
            image.src = this.clientUrl + filePath + fileName + "." + fileType;
        }

        return image;
    }

    /*private createPath(settings: PCFImageControlSettings): string {

        let fileName: string;

        if (settings.spaceReplace) {
            fileName = settings.fieldValue!.replace(/\\s+/gi, settings.spaceReplace);
        }
        else {
            fileName = settings.fieldValue!.replace(/\\s+/gi, '');
        }
        this.context.parameters.fieldValue.formatted
        let path: string = this.clientUrl + settings.filePath + fileName + '.' + settings.fileType;

        return path;
    }*/

    private assignImageDimensions(image: HTMLImageElement, height: number, width: number): HTMLImageElement {

        if (height === -1 && width === -1) {
            return image;
        }

        if (height >= 0 ) {
            image.height = height;
        }

        if (width >= 0) {
            image.width = width;
        }

        return image;

    }

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
        this.context = context;

        if ($('.optionImage')[0]) {
            this.generateImage(context);
            $('.optionImage').replaceWith(this.image);
        }
        else {
            this.imageContainer = document.createElement("div");
            this.imageContainer.classList.add("imageOptionField");

            this.image = document.createElement("img");
            this.image.classList.add("optionImage");
            this.generateImage(context);
            this.imageContainer.appendChild(this.image);

            this.container.appendChild(this.imageContainer);
        }
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}