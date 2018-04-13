/**
 * Created by zhijia.song on 2018/4/12.
 */
import React, {Component} from 'react';

const LIMIT_OFFSET = 90;
const SCREEN_HEIGHT = document.body.clientHeight || document.documentElement.clientHeight;
const WRAPPER_STYLE = {
    position: 'relative',
    overflow: 'hidden',
    height: '100%'

};

const ITEM_STYLE = {
    position: 'absolute',
    width: '100%',
    height: '100%'
};

class FullPageScroll extends Component {
    constructor(props, context) {
        super(props, context);
        this.pre = {};
        this.inScreen = {};
        this.after = {};
        this.startScreenY = 0;
        this.offset = 0;
        this.animation = false;
        this.init(this.props);
    }

    init(props) {
        const list = props.list;
        for (let i = 0; i < list.length; ++i) {
            const item = list[i];

            if (item.show) {
                this.pre = list[i - 1];
                this.inScreen = item;
                this.after = list[i + 1];
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        this.init(nextProps);
    }

    componentDidUpdate() {
        this.preEl.style.transition = '';
        this.showEl.style.transition = '';
        this.afterEl.style.transition = '';
        this.preEl.style.transform = `translateY(${-SCREEN_HEIGHT}px)`;
        this.showEl.style.transform = `translateY(${0}px)`;
        this.afterEl.style.transform = `translateY(${SCREEN_HEIGHT}px)`;
        this.animation = false;
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    handleTouchStart = (e) => {
        if (this.animation) {
            return;
        }
        this.startScreenY = e.touches[0].screenY;
    };

    handleTouchMove = (e) => {
        if (this.animation) {
            return;
        }
        const offset = e.touches[0].screenY - this.startScreenY;

        this.preEl.style.transform = `translateY(${-SCREEN_HEIGHT + offset}px)`;
        this.showEl.style.transform = `translateY(${offset}px)`;
        this.afterEl.style.transform = `translateY(${SCREEN_HEIGHT + offset}px)`;

        this.offset = offset;
    };

    handleTouchEnd = () => {
        if (this.animation) {
            return;
        }
        if (this.offset > LIMIT_OFFSET) { // 手指向下滑动，显示上一个
            this.prePage();
        } else if (this.offset < -LIMIT_OFFSET) { // 手指向上滑动，显示下一个
            this.nextPage();
        } else {
            this.preEl.style.transform = `translateY(${-SCREEN_HEIGHT}px)`;
            this.showEl.style.transform = `translateY(${0}px)`;
            this.afterEl.style.transform = `translateY(${SCREEN_HEIGHT}px)`;
        }
    };

    prePage = () => {
        this.preEl.style.transition = `all .4s`;
        this.showEl.style.transition = `all .4s`;
        this.afterEl.style.transition = `all .4s`;
        this.preEl.style.transform = `translateY(${0}px)`;
        this.showEl.style.transform = `translateY(${SCREEN_HEIGHT}px)`;
        this.afterEl.style.transform = `translateY(${2 * SCREEN_HEIGHT}px)`;
        this.animation = true;
        setTimeout(() => {
            this.props.onPrePage();
        }, 400);
    };

    nextPage = () => {
        this.preEl.style.transition = `all .4s`;
        this.showEl.style.transition = `all .4s`;
        this.afterEl.style.transition = `all .4s`;
        this.preEl.style.transform = `translateY(${-2 * SCREEN_HEIGHT}px)`;
        this.showEl.style.transform = `translateY(${-SCREEN_HEIGHT}px)`;
        this.afterEl.style.transform = `translateY(${0}px)`;
        this.animation = true;
        setTimeout(() => {
            this.props.onNextPage();
        }, 400);
    };


    renderList() {
        const Page = this.props.Page;
        let pre = (
            <div
                className="full-page-item"
                style={{...ITEM_STYLE, transform: `translateY(-${SCREEN_HEIGHT}px)`}}
                ref={r => this.preEl = r}
            >
                <Page data={this.pre.data}/>
            </div>
        );

        let inScreen = (
            <div
                className="full-page-item"
                style={ITEM_STYLE}
                ref={r => this.showEl = r}
            >
                <Page data={this.inScreen.data}/>
            </div>
        );

        let after = (
            <div
                className="full-page-item"
                style={{...ITEM_STYLE, transform: `translateY(${SCREEN_HEIGHT}px)`}}
                ref={r => this.afterEl = r}
            >
                <Page data={this.after.data}/>
            </div>
        );

        return [pre, inScreen, after];
    }

    render() {

        return (
            <div
                className="full-page-wrapper"
                style={WRAPPER_STYLE}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onTouchEnd={this.handleTouchEnd}
            >
                {this.renderList()}
            </div>
        )
    }
}

export default FullPageScroll;