// Copyright (C) 2017-2022 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('@stremio/stremio-icons/dom');
const { Button, useStreamingServer, useToast } = require('stremio/common');
const styles = require('./styles');

const OptionsMenu = ({ className, stream }) => {
    const streamingServer = useStreamingServer();
    const toast = useToast();
    const streamUrl = React.useMemo(() => {
        return stream !== null ?
            typeof stream.url === 'string' ?
                stream.url
                :
                typeof stream.infoHash === 'string' &&
                typeof stream.fileIdx === 'number' &&
                typeof streamingServer.selected === 'object' &&
                typeof streamingServer.selected.transportUrl === 'string' ?
                    `${streamingServer.selected.transportUrl}${stream.infoHash}/${stream.fileIdx}`
                    :
                    null
            :
            null;
    }, [stream, streamingServer]);
    const onCopyStreamButtonClick = React.useCallback(() => {
        if (streamUrl !== null) {
            navigator.clipboard.writeText(streamUrl)
                .then(() => {
                    toast.show({
                        type: 'success',
                        title: 'Copied',
                        message: 'Stream link was copied to your clipboard',
                        timeout: 3000
                    });
                })
                .catch((e) => {
                    console.error(e);
                    toast.show({
                        type: 'error',
                        title: 'Error',
                        message: 'Failed to copy stream link. Try to enable your browser permission.',
                        timeout: 3000
                    });
                });
        }
    }, [streamUrl]);
    const onDownloadVideoButtonClick = React.useCallback(() => {
        if (streamUrl !== null) {
            window.open(streamUrl);
        }
    }, [streamUrl]);
    const onExternalPlayerButtonClick = React.useCallback(() => {
        if (streamUrl !== null) {
            window.open(`vlc://${encodeURIComponent(streamUrl)}`);
        }
    }, [streamUrl]);
    const onMouseDown = React.useCallback((event) => {
        event.nativeEvent.optionsMenuClosePrevented = true;
    }, []);
    return (
        <div className={classnames(className, styles['options-menu-container'])} onMouseDown={onMouseDown}>
            <Button className={classnames(styles['option-container'], { 'disabled': stream === null })} disabled={stream === null} onClick={onCopyStreamButtonClick}>
                <Icon className={styles['icon']} icon={'ic_link'} />
                <div className={styles['label']}>Copy Stream Link</div>
            </Button>
            <Button className={classnames(styles['option-container'], { 'disabled': stream === null })} disabled={stream === null}onClick={onDownloadVideoButtonClick}>
                <Icon className={styles['icon']} icon={'ic_downloads'} />
                <div className={styles['label']}>Download Video</div>
            </Button>
            <Button className={classnames(styles['option-container'], { 'disabled': stream === null })} disabled={stream === null} onClick={onExternalPlayerButtonClick}>
                <Icon className={styles['icon']} icon={'ic_vlc'} />
                <div className={styles['label']}>Play in External Player</div>
            </Button>
        </div>
    );
};

OptionsMenu.propTypes = {
    className: PropTypes.string,
    stream: PropTypes.object
};

module.exports = OptionsMenu;
