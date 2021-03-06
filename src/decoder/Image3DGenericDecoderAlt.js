/*
* Author    Jonathan Lurie - http://me.jonathanlurie.fr
*
* License   MIT
* Link      https://github.com/Pixpipe/pixpipejs
* Lab       MCIN - Montreal Neurological Institute
*/


import { Filter } from '../core/Filter.js';
import { Image3DAlt } from '../core/Image3DAlt.js';

// decoders
import { Minc2DecoderAlt } from './Minc2DecoderAlt.js';
import { NiftiDecoderAlt } from './NiftiDecoderAlt.js';
import { MghDecoderAlt } from './MghDecoderAlt.js';
//import { PixpDecoder } from './PixpDecoder.js';
//import { PixBinDecoder } from './PixBinDecoder.js';


/**
* An instance of Image3DGenericDecoderAlt takes a ArrayBuffer 
* as input 0 (`.addInput(myArrayBuffer)`) and output an Image3D.
* The `update` method will perform several decoding attempts, using the readers
* specified in the constructor.
* In case of success (one of the registered decoder was compatible to the data)
* the metadata `decoderConstructor` and `decoderName` are made accessible and give
* information about the file format. If no decoder managed to decode the input buffer,
* this filter will not have any output.
*
* Developers: if a new 3D dataset decoder is added, reference it here.
*/
class Image3DGenericDecoderAlt extends Filter {
  
  constructor(){
    super();
    
    this._decoders = [
      Minc2DecoderAlt,
      NiftiDecoderAlt,
      MghDecoderAlt,
      //PixpDecoder,
      //PixBinDecoder
    ];
  }
  
  
  _run(){
    var inputBuffer = this._getInput(0);
    
    if(!inputBuffer){
      console.warn("The input buffer must not be null.");
      return;
    }
    
    // try with each decoder
    for(var d=0; d<this._decoders.length; d++){
      var decoder = new this._decoders[d]();
      decoder.addInput( inputBuffer );
      decoder.update();
      
      if(decoder.getNumberOfOutputs()){
        this._output[0] = decoder.getOutput();
        console.log( this._output[0] );
        this.setMetadata("decoderConstructor", this._decoders[d]);
        this.setMetadata("decoderName", this._decoders[d].name);
        break;
      }
    }
  }
  
  
} /* END of class Image3DGenericDecoderAlt */

export { Image3DGenericDecoderAlt }
