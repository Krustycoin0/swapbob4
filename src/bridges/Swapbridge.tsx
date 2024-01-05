import { LiFiWidget, WidgetConfig } from '@lifi/widget';

const widgetConfig: WidgetConfig = {
  integrator: 'Perseus',
  toChain: 56,
  toToken: '0xfa4C07636B53D868E514777B9d4005F1e9c6c40B',
  containerStyle: {
    border: '1px solid rgb(234, 234, 234)',
    borderRadius: '16px',
    logoURI:'https://postimg.cc/gallery/tbHPmcH'
  },
  },
};

export const SwapWidget = () => {
  return <LiFiWidget config={widgetConfig} />;
};
