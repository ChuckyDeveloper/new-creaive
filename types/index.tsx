


// Children 
// export PropsChildren 


// Header
export interface HeaderProps {
    children?: React.ReactNode;
    topic?: string;
    tagline?: string[];
}



// //  Buttons
// export interface ButtonProps {
//     children?: React.ReactNode;
//     onClick?: any;
//     text?: string;
//     type?: string;
//     props?: any;
// }

//  Buttons New
export interface ButtonProps {
    children?: React.ReactNode;
    onClick?: any;
    text?: string;
    bgColor?: string;
    width?: string;
    height?: string;
    font?:  string;
    fontColor?: string;
    href_?: string | null;
    padding?: string;
    margin?: string;
    props?: any;
    type?: string;
    disabled?: boolean;

}


// Crads
interface Bodies {
    body: string[];
}

type Props = {
    children: JSX.Element | JSX.Element[]
}

export interface CardProps {
    children?: React.ReactNode;
    type?: string;
    topic?: string;
    tagline?: string;
    body?: string[];
    props?: any;
}