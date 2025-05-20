import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Renderer2,
} from '@angular/core';
import { firstValueFrom, fromEvent } from 'rxjs';
import { Store } from '@ngrx/store';
import { postsActions } from '../../data/store/actions';
import { selectAllPosts, selectPostsLoading } from '../../data/store/selectors';
import { AsyncPipe } from '@angular/common';
import { PostInputComponent } from '../../ui/post-input/post-input.component';
import { PostComponent } from '../post/post.component';


@Component({
  selector: 'app-post-feed',
  standalone: true, // Добавляем если используем standalone компоненты
  imports: [PostInputComponent, PostComponent, AsyncPipe], // Добавляем импорты
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent {
  store = inject(Store);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  posts$ = this.store.select(selectAllPosts);
  loading$ = this.store.select(selectPostsLoading);

  ngOnInit() {
    console.log('Dispatching loadPosts action');
    this.store.dispatch(postsActions.loadPosts());
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.resizeFeed();
  }

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize').subscribe(() => {
      console.log(12313);
    });
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24 - 24;

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
