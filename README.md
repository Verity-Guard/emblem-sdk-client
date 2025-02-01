# Emblem SDK Client

Client SDK for interacting with the Emblem API

## Installation

```sh
npm install @verityguard/emblem-sdk-client
```

or

```sh
yarn add @verityguard/emblem-sdk-client
```

## Usage

```jsx
import React, { useRef } from 'react';
import { EmblemButton } from '@verityguard/emblem-sdk-client';

function App() {
  const closeWindowRef = useRef<() => void>();

  useEffect(() => {
    if (completed) {
      closeWindowRef.current?.();
    }
  }, [completed]);

  return (
    <div>
      <EmblemButton
        url={"https://example.com"}
        projectKey={"public_key_1234"}
        state={"state1234"}
        style={{ marginRight: "1rem", border: "1px solid gray" }}
        reviewRedirectUrl={"https://example.com/finish"}
        postbackUrl={"https://example.com/postback"}
        postbackHeaders={JSON.stringify({ 'x-gateway': 'abcd-1234' })}
        onClickCallback={() => console.log("onClick callback")}
        assignCloseWindow={(closeFn) => {
          closeWindowRef.current = closeFn;
        }}
      />
    </div>
  );
}

export default App;
```


## `EmblemButton` Props


| Prop              | Type                            | Required | Description                                                                                                                                                                                        |
| ----------------- | ------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url               | string                          | true     | Emblem host url                                                                                                                                                                                    |
| projectKey        | string                          | true     | Project key is provided by Emblem                                                                                                                                                                  |
| state             | string                          | true     | State is a unique identifier for the user provided by the integrator (you). This can be JSON encoded if you want to store more data with it. Emblem will pass this string along through every step |
| postbackUrl       | string                          | true     | URL that Emblem will send a POST request to after the user completes the age verification flow                                                                                                     |
| postbackHeaders   | string                          | false    | JSON stringified object that will be url encoded within the button component. These headers will be included with the POST request                                                                 |
| postbackOverride  | boolean                         | false    | If true, only the postback will be sent. The POST to the project key's verification url will not be sent                                                                                           |
| reviewRedirectUrl | string                          | false    | Custom redirect url for manual review                                                                                                                                                              |
| onClickCallback   | function                        | false    | This function will be called in addition to opening the Emblem window                                                                                                                              |
| label             | string                          | false    | Custom button text                                                                                                                                                                                 |
| className         | string                          | false    | Custom CSS class                                                                                                                                                                                   |
| style             | object                          | false    | Custom style object                                                                                                                                                                                |
| assignCloseWindow | (closeFunc: () => void) => void | false    | Allows implementers to receive a function that can be used to programmatically close the opened Emblem window on-demand                                                                            |

---

```typescript
interface Props {
  url: string;
  projectKey: string;
  state: string;
  reviewRedirectUrl: string;
  postbackUrl: string;
  postbackHeaders?: string;
  postbackOverride?: boolean; 
  onClickCallback?: () => void;
  label?: string;
  className?: string;
  style?: CSSProperties;
  assignCloseWindow?: (closeFunc: () => void) => void;
}
```

## Contributing

If you have suggestions for how emblem-sdk-client could be improved, or want to report a bug, open an issue! We'd love all and any contributions.
