import { makeStyles } from "@material-ui/core/styles";
const width = window.innerWidth;
const height = window.innerHeight;

const LabelStyle = makeStyles((theme) => ({
   extra_large_label: {
      fontSize: width * 0.1,
   },
   large_label: {
      fontSize: width * 0.06,
   },
   medium_label: {
      fontSize: width * 0.04,
      padding: 10
   },
   small_label: {
      fontSize: width * 0.03,
   },
   info: {

   },
   warning: {

   },
   link: {
      color: '#8bc4f0'
   },
   success: {

   },
   notice: {

   },
   brand: {
      color: '#083451',
      textAlign: 'center'
   },
   default: {
      textAlign: 'center',
      paddingTop: height * 0.03,
      paddingBottom: height * 0.03,
      textShadowColor: '#000',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 0.5
   },
   branding: {
      color: '#083451',
      textAlign: 'center',
      paddingBottom: height * 0.03,
   },
   level_one: {
      color: '#fdd07b'
   },
   level_two: {
      color: '#f09e01'
   },
   level_three: {
      color: '#ac4a4b'
   },
   header_text: {
      color: 'white',
      fontSize: width * 0.05
   }
}))

export { LabelStyle };
